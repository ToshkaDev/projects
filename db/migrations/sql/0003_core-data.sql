-- Unless otherwise specified, all unqualified external database identifers are assumed to be from
-- RefSeq. For example, components.accession refers to the RefSeq accession.

create table genomes_references (
	id serial primary key,
	genome_id integer not null,
	title text not null,
	authors text,
	consortium text,
	journal text,
	pubmed_id integer,
	medline_id integer,
	remark text,
	notes text
);
create index on genomes_references(genome_id);

create table components (
	id serial primary key,
	genome_id integer not null,

	-- The following are acquired from the genome assembly report
	accession text not null,			-- RefSeq-Accn
	genbank_accession text,				-- GenBank-Accn
	name text,							-- Sequence-Name (e.g. ANONYMOUS or Contig01)
	role text,							-- Sequence-Role (e.g. assembled-molecule or unplaced-scaffold)
	assigned_molecule text,				-- Assigned-Molecule (e.g. na)
	type text,							-- Assigned-Molecule-Location/Type (e.g. Chromosome or na)
	genbank_refseq_relationship text,	-- Relationship (e.g. '=')

	-- Sourced from the GenBank-formatted RefSeq record
	molecule_type text,					-- LOCUS.moleculeType
	is_circular boolean,				-- LOCUS.topology
	annotation_date date,				-- LOCUS.date
	dna text not null,					-- ORIGIN
	length integer not null,			-- Calculated

	stats jsonb not null default '{}',

	created_at timestamp with time zone not null default now(),
	updated_at timestamp with time zone not null default now(),

	unique(accession),

	foreign key(genome_id) references genomes(id) on update cascade on delete cascade
);
create index on components(genome_id);
create index on components(accession);

-- Genes contains the data for not only gene features, but also any associated CDS or RNA features.
-- All other features are stored in the components_features table further below.
--
-- Or really, any gene that is linked to another feature that has the exact same location. If CDS,
-- then handle the corresponding amino acid sequence if it has a translation.
create table genes (
	id serial primary key,
	component_id integer not null,
	dseq_id integer not null,
	aseq_id text,

	accession text,					-- No version suffix; RefSeq GenBank.protein_id prefix
	version integer,				-- Only the version; RefSeq GenBank.protein_id suffix
	locus text,						-- RefSeq assigned locus
	old_locus text,					-- Typically the GenBank locus

	location text not null,
	strand char(1) not null,		-- +, -, or .
	-- Note: start may be > stop if the component is circular and the gene spans the origin
	start integer not null,			-- 1-based 5' position if strand is + or ., 3' otherwise
	stop integer not null,			-- 1-based 3' position if strand is + or ., 3' otherwise
	length integer not null,		-- typically this equals stop - start + 1 except in the cases
									--   where the feature spans the origin

	type text,						-- cds, \w+RNA, ... or null if not associated
	names text[],					-- names[0] = /gene, [1..] = remaining /gene and /gene_synonym
	pseudo boolean not null default false,
	product text,					-- source from /product
	codon_start integer,			-- 1, 2, or 3
	translation_table integer,
	notes text,						-- sourced from /note
	qualifiers jsonb,				-- associated qualifiers from CDS, etc. take precedence over any
									--   gene qualifiers that have the same name

	foreign key(component_id) references components(id) on update cascade on delete cascade
);
create index on genes(component_id);
create index on genes(aseq_id);
create index on genes(accession);
create index on genes(locus);

comment on column genes.locus is 'First defined value of locus, old_locus_tag, name; if all undefined, then it is ${genus}[0]${species}[0..2]_${start}-${stop}';
comment on column genes.strand is '+, -, or . (unknown)';
comment on column genes.start is 'Positive, integer, 1-based, inclusive start position regardless of strand';
comment on column genes.start is 'Positive, integer, 1-based, inclusive stop position regardless of strand';

create table xrefs (
	id serial primary key,
	gene_id integer not null,
	database text not null,
	values text[] not null,

	foreign key(gene_id) references genes(id) on update cascade on delete cascade
);
create index on xrefs(values)

-- Catch all for the other features
create table components_features (
	id serial primary key,
	component_id integer not null,
	dseq_id integer not null,
	key text not null,
	location text not null,
	-- Note: start may be > stop if the component is circular and the gene spans the origin
	start integer not null,			-- 1-based 5' position if strand is + or ., 3' otherwise
	stop integer not null,			-- 1-based 3' position if strand is + or ., 3' otherwise
	length integer not null,		-- typically this equals stop - start + 1 except in the cases
									--   where the gene spans the origin
	qualifiers jsonb,

	foreign key(component_id) references components(id) on update cascade on delete cascade
);
