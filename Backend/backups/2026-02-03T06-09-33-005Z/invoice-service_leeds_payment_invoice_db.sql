--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_Users_status; Type: TYPE; Schema: public; Owner: oac_softwares
--

CREATE TYPE public."enum_Users_status" AS ENUM (
    'pending_approval',
    'approved',
    'rejected',
    'suspended'
);


ALTER TYPE public."enum_Users_status" OWNER TO oac_softwares;

--
-- Name: enum_users_status; Type: TYPE; Schema: public; Owner: oac_softwares
--

CREATE TYPE public.enum_users_status AS ENUM (
    'pending_approval',
    'approved',
    'rejected',
    'suspended'
);


ALTER TYPE public.enum_users_status OWNER TO oac_softwares;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: PerformaInvoiceStatuses; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public."PerformaInvoiceStatuses" (
    id integer NOT NULL,
    "performaInvoiceId" integer,
    status character varying(255),
    date timestamp with time zone,
    comment text,
    "changedBy" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."PerformaInvoiceStatuses" OWNER TO oac_softwares;

--
-- Name: PerformaInvoiceStatuses_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public."PerformaInvoiceStatuses_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PerformaInvoiceStatuses_id_seq" OWNER TO oac_softwares;

--
-- Name: PerformaInvoiceStatuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public."PerformaInvoiceStatuses_id_seq" OWNED BY public."PerformaInvoiceStatuses".id;


--
-- Name: PerformaInvoices; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public."PerformaInvoices" (
    id integer NOT NULL,
    "piNo" character varying(255) NOT NULL,
    url json[],
    "bankSlip" character varying(255),
    status character varying(255) DEFAULT 'Generated'::character varying,
    "salesPersonId" integer,
    "kamId" integer,
    "amId" integer,
    "accountantId" integer,
    count integer DEFAULT 1,
    "supplierId" integer,
    "supplierSoNo" character varying(255),
    "supplierPoNo" character varying(255),
    "supplierCurrency" character varying(255),
    "supplierPrice" character varying(255),
    "customerId" integer,
    "customerSoNo" character varying(255),
    "customerPoNo" character varying(255),
    "customerCurrency" character varying(255),
    "poValue" character varying(255),
    "paymentMode" character varying(255),
    purpose character varying(255),
    "addedById" integer,
    notes text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."PerformaInvoices" OWNER TO oac_softwares;

--
-- Name: PerformaInvoices_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public."PerformaInvoices_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PerformaInvoices_id_seq" OWNER TO oac_softwares;

--
-- Name: PerformaInvoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public."PerformaInvoices_id_seq" OWNED BY public."PerformaInvoices".id;


--
-- Name: Team; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public."Team" (
    id integer NOT NULL,
    "teamName" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Team" OWNER TO oac_softwares;

--
-- Name: TeamLeader; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public."TeamLeader" (
    id integer NOT NULL,
    "teamId" integer,
    "userId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."TeamLeader" OWNER TO oac_softwares;

--
-- Name: TeamLeader_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public."TeamLeader_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TeamLeader_id_seq" OWNER TO oac_softwares;

--
-- Name: TeamLeader_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public."TeamLeader_id_seq" OWNED BY public."TeamLeader".id;


--
-- Name: TeamMember; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public."TeamMember" (
    id integer NOT NULL,
    "teamId" integer,
    "userId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."TeamMember" OWNER TO oac_softwares;

--
-- Name: TeamMember_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public."TeamMember_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TeamMember_id_seq" OWNER TO oac_softwares;

--
-- Name: TeamMember_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public."TeamMember_id_seq" OWNED BY public."TeamMember".id;


--
-- Name: Team_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public."Team_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Team_id_seq" OWNER TO oac_softwares;

--
-- Name: Team_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public."Team_id_seq" OWNED BY public."Team".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    emp_no character varying(255),
    role_id integer DEFAULT 1 NOT NULL,
    is_active boolean DEFAULT false,
    status public."enum_Users_status" DEFAULT 'pending_approval'::public."enum_Users_status",
    approved_by integer,
    approved_at timestamp with time zone,
    last_login timestamp with time zone,
    failed_login_attempts integer DEFAULT 0,
    password_changed_at timestamp with time zone,
    reset_password_token character varying(255),
    reset_password_expires timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO oac_softwares;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO oac_softwares;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: company; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public.company (
    id integer NOT NULL,
    "companyName" character varying(255),
    code character varying(255),
    "contactPerson" character varying(255),
    designation character varying(255),
    email character varying(255),
    website character varying(255),
    "phoneNumber" character varying(255),
    address1 character varying(255),
    address2 character varying(255),
    city character varying(255),
    country character varying(255),
    state character varying(255),
    zipcode character varying(255),
    "linkedIn" character varying(255),
    remarks character varying(255),
    customer boolean,
    supplier boolean,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.company OWNER TO oac_softwares;

--
-- Name: company_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public.company_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.company_id_seq OWNER TO oac_softwares;

--
-- Name: company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public.company_id_seq OWNED BY public.company.id;


--
-- Name: performaInvoices; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public."performaInvoices" (
    id integer NOT NULL,
    "piNo" character varying(255) NOT NULL,
    url json[],
    "bankSlip" character varying(255),
    status character varying(255) DEFAULT 'Generated'::character varying,
    "salesPersonId" integer,
    "kamId" integer,
    "amId" integer,
    "accountantId" integer,
    count integer DEFAULT 1,
    "supplierId" integer,
    "supplierSoNo" character varying(255),
    "supplierPoNo" character varying(255),
    "supplierCurrency" character varying(255),
    "supplierPrice" character varying(255),
    "customerId" integer,
    "customerSoNo" character varying(255),
    "customerPoNo" character varying(255),
    "customerCurrency" character varying(255),
    "poValue" character varying(255),
    "paymentMode" character varying(255),
    purpose character varying(255),
    "addedById" integer,
    notes text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."performaInvoices" OWNER TO oac_softwares;

--
-- Name: performaInvoices_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public."performaInvoices_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."performaInvoices_id_seq" OWNER TO oac_softwares;

--
-- Name: performaInvoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public."performaInvoices_id_seq" OWNED BY public."performaInvoices".id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    role_name character varying(255) NOT NULL,
    description text,
    permissions jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO oac_softwares;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO oac_softwares;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    emp_no character varying(255),
    role_id integer DEFAULT 1 NOT NULL,
    is_active boolean DEFAULT false,
    status public.enum_users_status DEFAULT 'pending_approval'::public.enum_users_status,
    approved_by integer,
    approved_at timestamp with time zone,
    last_login timestamp with time zone,
    failed_login_attempts integer DEFAULT 0,
    password_changed_at timestamp with time zone,
    reset_password_token character varying(255),
    reset_password_expires timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO oac_softwares;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO oac_softwares;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: PerformaInvoiceStatuses id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."PerformaInvoiceStatuses" ALTER COLUMN id SET DEFAULT nextval('public."PerformaInvoiceStatuses_id_seq"'::regclass);


--
-- Name: PerformaInvoices id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."PerformaInvoices" ALTER COLUMN id SET DEFAULT nextval('public."PerformaInvoices_id_seq"'::regclass);


--
-- Name: Team id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Team" ALTER COLUMN id SET DEFAULT nextval('public."Team_id_seq"'::regclass);


--
-- Name: TeamLeader id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."TeamLeader" ALTER COLUMN id SET DEFAULT nextval('public."TeamLeader_id_seq"'::regclass);


--
-- Name: TeamMember id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."TeamMember" ALTER COLUMN id SET DEFAULT nextval('public."TeamMember_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Name: company id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company ALTER COLUMN id SET DEFAULT nextval('public.company_id_seq'::regclass);


--
-- Name: performaInvoices id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."performaInvoices" ALTER COLUMN id SET DEFAULT nextval('public."performaInvoices_id_seq"'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: PerformaInvoiceStatuses; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."PerformaInvoiceStatuses" (id, "performaInvoiceId", status, date, comment, "changedBy", "createdAt", "updatedAt") FROM stdin;
6	2	GENERATED	2026-01-14 17:04:46.47+05:30	\N	\N	2026-01-14 17:04:46.471+05:30	2026-01-14 17:04:46.471+05:30
7	2	GENERATED	2026-01-14 17:09:50.231+05:30	\N	\N	2026-01-14 17:09:50.232+05:30	2026-01-14 17:09:50.232+05:30
8	2	GENERATED	2026-01-14 17:11:15.142+05:30	\N	\N	2026-01-14 17:11:15.143+05:30	2026-01-14 17:11:15.143+05:30
9	3	INITIATED	2026-01-14 17:48:19.815+05:30	\N	\N	2026-01-14 17:48:19.815+05:30	2026-01-14 17:48:19.815+05:30
10	3	INITIATED	2026-01-14 17:50:29.237+05:30	\N	\N	2026-01-14 17:50:29.238+05:30	2026-01-14 17:50:29.238+05:30
11	3	AM APPROVED	2026-01-14 17:52:39.104+05:30	\N	\N	2026-01-14 17:52:39.104+05:30	2026-01-14 17:52:39.104+05:30
12	3	CARD PAYMENT SUCCESS	2026-01-14 17:59:15.734+05:30	\N	\N	2026-01-14 17:59:15.734+05:30	2026-01-14 17:59:15.734+05:30
13	2	KAM VERIFIED	2026-01-15 12:16:04.753+05:30	\N	\N	2026-01-15 12:16:04.755+05:30	2026-01-15 12:16:04.755+05:30
15	2	AM REJECTED	2026-01-15 12:17:17.876+05:30	\N	\N	2026-01-15 12:17:17.876+05:30	2026-01-15 12:17:17.876+05:30
16	2	GENERATED	2026-01-15 12:17:55.111+05:30	\N	\N	2026-01-15 12:17:55.112+05:30	2026-01-15 12:17:55.112+05:30
17	2	KAM VERIFIED	2026-01-15 12:24:40.058+05:30	\N	\N	2026-01-15 12:24:40.058+05:30	2026-01-15 12:24:40.058+05:30
18	2	AM VERIFIED	2026-01-15 12:25:05.498+05:30	\N	\N	2026-01-15 12:25:05.498+05:30	2026-01-15 12:25:05.498+05:30
19	2	BANK SLIP ISSUED	2026-01-15 12:25:37.471+05:30	\N	\N	2026-01-15 12:25:37.471+05:30	2026-01-15 12:25:37.471+05:30
27	10	GENERATED	2026-01-16 16:13:18.652+05:30	\N	\N	2026-01-16 16:13:18.652+05:30	2026-01-16 16:13:18.652+05:30
\.


--
-- Data for Name: PerformaInvoices; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."PerformaInvoices" (id, "piNo", url, "bankSlip", status, "salesPersonId", "kamId", "amId", "accountantId", count, "supplierId", "supplierSoNo", "supplierPoNo", "supplierCurrency", "supplierPrice", "customerId", "customerSoNo", "customerPoNo", "customerCurrency", "poValue", "paymentMode", purpose, "addedById", notes, "createdAt", "updatedAt") FROM stdin;
2	E-002	{"{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/ca0d62f2-d2e8-4d68-8ce0-ff99b3507030.png\\",\\"remarks\\":\\"Doc1\\"}","{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/138c1304-4f81-4ec3-84aa-86df15000c6a.png\\",\\"remarks\\":\\"doc2\\"}"}	https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/bankslips/e9676ddf-9486-45dc-824e-5837d0beb94f.png	BANK SLIP ISSUED	22	20	21	23	4	1	SO002	PO002	Dollar	185	2	SO002	PO002	Dollar	150	WireTransfer	Customer	22		2026-01-14 17:04:45.01+05:30	2026-01-15 12:25:37.464+05:30
3	E-003	{"{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/7619ba34-8b46-446e-aac3-95baf267d129.png\\",\\"remarks\\":\\"\\"}"}	https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/bankslips/83476934-76c0-4997-b264-bf1a71b59584.png	CARD PAYMENT SUCCESS	22	20	21	\N	2	1	SO003	PO003	Dollar	175	\N			Dollar	\N	CreditCard	Stock	22	CC003	2026-01-14 17:48:19.203+05:30	2026-01-14 17:59:15.724+05:30
10	E-004	{"{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/f746b7f6-e4b4-4dd7-ac90-7b014e790844.png\\",\\"remarks\\":\\"\\"}"}	\N	GENERATED	22	20	\N	\N	1	1	SO004	PO004	Dollar	174	\N			Dollar	\N	WireTransfer	Stock	22	qwdqwdqw	2026-01-16 16:13:16.462+05:30	2026-01-16 16:13:16.462+05:30
\.


--
-- Data for Name: Team; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."Team" (id, "teamName", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: TeamLeader; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."TeamLeader" (id, "teamId", "userId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: TeamMember; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."TeamMember" (id, "teamId", "userId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."Users" (id, email, password, name, emp_no, role_id, is_active, status, approved_by, approved_at, last_login, failed_login_attempts, password_changed_at, reset_password_token, reset_password_expires, "createdAt", "updatedAt") FROM stdin;
1	superadmin@leedsaerospace.com	$2a$10$FZvGsMxXp2.oeqoMimrF0eRb9tR8qBuOel7ubt22P/vdAo4BbRLKy	System Super Administrator	SA001	1	t	approved	\N	\N	\N	0	\N	\N	\N	2025-12-30 12:23:45.727+05:30	2025-12-30 12:23:45.727+05:30
\.


--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public.company (id, "companyName", code, "contactPerson", designation, email, website, "phoneNumber", address1, address2, city, country, state, zipcode, "linkedIn", remarks, customer, supplier, "createdAt", "updatedAt") FROM stdin;
1	Comp	COMP	Person		person@comp.com	comp.com	1234567890									t	t	2025-12-30 17:00:33.446+05:30	2025-12-30 17:00:33.446+05:30
2	Comp2fgbg	COMP	Person2													t	f	2025-12-30 17:01:50.594+05:30	2025-12-30 17:12:32.752+05:30
\.


--
-- Data for Name: performaInvoices; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."performaInvoices" (id, "piNo", url, "bankSlip", status, "salesPersonId", "kamId", "amId", "accountantId", count, "supplierId", "supplierSoNo", "supplierPoNo", "supplierCurrency", "supplierPrice", "customerId", "customerSoNo", "customerPoNo", "customerCurrency", "poValue", "paymentMode", purpose, "addedById", notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public.roles (id, role_name, description, permissions, is_active, created_at, updated_at) FROM stdin;
1	Super Administrator	\N	[]	t	2026-01-05 10:35:19.963+05:30	2026-01-05 10:35:19.963+05:30
2	Administrator	\N	[]	t	2026-01-05 10:35:19.963+05:30	2026-01-05 10:35:19.963+05:30
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public.users (id, email, password, name, emp_no, role_id, is_active, status, approved_by, approved_at, last_login, failed_login_attempts, password_changed_at, reset_password_token, reset_password_expires, "createdAt", "updatedAt") FROM stdin;
1	superadmin@leedsaerospace.com	$2a$10$C19/b7FH6O5vGI/hJKnOE.O2AbrMUlfNIgezgYuJ1ubCOKYI/7Ro.	System Super Administrator	SA001	1	t	approved	\N	\N	\N	0	\N	\N	\N	2026-01-05 10:35:20.247+05:30	2026-01-05 10:35:20.247+05:30
\.


--
-- Name: PerformaInvoiceStatuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."PerformaInvoiceStatuses_id_seq"', 27, true);


--
-- Name: PerformaInvoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."PerformaInvoices_id_seq"', 10, true);


--
-- Name: TeamLeader_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."TeamLeader_id_seq"', 1, false);


--
-- Name: TeamMember_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."TeamMember_id_seq"', 1, false);


--
-- Name: Team_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."Team_id_seq"', 1, false);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."Users_id_seq"', 1, true);


--
-- Name: company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public.company_id_seq', 2, true);


--
-- Name: performaInvoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."performaInvoices_id_seq"', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public.roles_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: PerformaInvoiceStatuses PerformaInvoiceStatuses_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."PerformaInvoiceStatuses"
    ADD CONSTRAINT "PerformaInvoiceStatuses_pkey" PRIMARY KEY (id);


--
-- Name: PerformaInvoices PerformaInvoices_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."PerformaInvoices"
    ADD CONSTRAINT "PerformaInvoices_pkey" PRIMARY KEY (id);


--
-- Name: TeamLeader TeamLeader_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."TeamLeader"
    ADD CONSTRAINT "TeamLeader_pkey" PRIMARY KEY (id);


--
-- Name: TeamMember TeamMember_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."TeamMember"
    ADD CONSTRAINT "TeamMember_pkey" PRIMARY KEY (id);


--
-- Name: Team Team_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Team"
    ADD CONSTRAINT "Team_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_email_key1; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key1" UNIQUE (email);


--
-- Name: Users Users_email_key10; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key10" UNIQUE (email);


--
-- Name: Users Users_email_key100; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key100" UNIQUE (email);


--
-- Name: Users Users_email_key101; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key101" UNIQUE (email);


--
-- Name: Users Users_email_key102; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key102" UNIQUE (email);


--
-- Name: Users Users_email_key103; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key103" UNIQUE (email);


--
-- Name: Users Users_email_key104; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key104" UNIQUE (email);


--
-- Name: Users Users_email_key105; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key105" UNIQUE (email);


--
-- Name: Users Users_email_key106; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key106" UNIQUE (email);


--
-- Name: Users Users_email_key107; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key107" UNIQUE (email);


--
-- Name: Users Users_email_key108; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key108" UNIQUE (email);


--
-- Name: Users Users_email_key109; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key109" UNIQUE (email);


--
-- Name: Users Users_email_key11; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key11" UNIQUE (email);


--
-- Name: Users Users_email_key110; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key110" UNIQUE (email);


--
-- Name: Users Users_email_key111; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key111" UNIQUE (email);


--
-- Name: Users Users_email_key112; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key112" UNIQUE (email);


--
-- Name: Users Users_email_key113; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key113" UNIQUE (email);


--
-- Name: Users Users_email_key114; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key114" UNIQUE (email);


--
-- Name: Users Users_email_key115; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key115" UNIQUE (email);


--
-- Name: Users Users_email_key116; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key116" UNIQUE (email);


--
-- Name: Users Users_email_key117; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key117" UNIQUE (email);


--
-- Name: Users Users_email_key118; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key118" UNIQUE (email);


--
-- Name: Users Users_email_key119; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key119" UNIQUE (email);


--
-- Name: Users Users_email_key12; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key12" UNIQUE (email);


--
-- Name: Users Users_email_key120; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key120" UNIQUE (email);


--
-- Name: Users Users_email_key121; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key121" UNIQUE (email);


--
-- Name: Users Users_email_key122; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key122" UNIQUE (email);


--
-- Name: Users Users_email_key123; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key123" UNIQUE (email);


--
-- Name: Users Users_email_key124; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key124" UNIQUE (email);


--
-- Name: Users Users_email_key125; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key125" UNIQUE (email);


--
-- Name: Users Users_email_key126; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key126" UNIQUE (email);


--
-- Name: Users Users_email_key127; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key127" UNIQUE (email);


--
-- Name: Users Users_email_key128; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key128" UNIQUE (email);


--
-- Name: Users Users_email_key129; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key129" UNIQUE (email);


--
-- Name: Users Users_email_key13; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key13" UNIQUE (email);


--
-- Name: Users Users_email_key130; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key130" UNIQUE (email);


--
-- Name: Users Users_email_key131; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key131" UNIQUE (email);


--
-- Name: Users Users_email_key132; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key132" UNIQUE (email);


--
-- Name: Users Users_email_key133; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key133" UNIQUE (email);


--
-- Name: Users Users_email_key134; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key134" UNIQUE (email);


--
-- Name: Users Users_email_key135; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key135" UNIQUE (email);


--
-- Name: Users Users_email_key136; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key136" UNIQUE (email);


--
-- Name: Users Users_email_key137; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key137" UNIQUE (email);


--
-- Name: Users Users_email_key138; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key138" UNIQUE (email);


--
-- Name: Users Users_email_key139; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key139" UNIQUE (email);


--
-- Name: Users Users_email_key14; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key14" UNIQUE (email);


--
-- Name: Users Users_email_key140; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key140" UNIQUE (email);


--
-- Name: Users Users_email_key15; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key15" UNIQUE (email);


--
-- Name: Users Users_email_key16; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key16" UNIQUE (email);


--
-- Name: Users Users_email_key17; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key17" UNIQUE (email);


--
-- Name: Users Users_email_key18; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key18" UNIQUE (email);


--
-- Name: Users Users_email_key19; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key19" UNIQUE (email);


--
-- Name: Users Users_email_key2; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key2" UNIQUE (email);


--
-- Name: Users Users_email_key20; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key20" UNIQUE (email);


--
-- Name: Users Users_email_key21; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key21" UNIQUE (email);


--
-- Name: Users Users_email_key22; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key22" UNIQUE (email);


--
-- Name: Users Users_email_key23; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key23" UNIQUE (email);


--
-- Name: Users Users_email_key24; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key24" UNIQUE (email);


--
-- Name: Users Users_email_key25; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key25" UNIQUE (email);


--
-- Name: Users Users_email_key26; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key26" UNIQUE (email);


--
-- Name: Users Users_email_key27; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key27" UNIQUE (email);


--
-- Name: Users Users_email_key28; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key28" UNIQUE (email);


--
-- Name: Users Users_email_key29; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key29" UNIQUE (email);


--
-- Name: Users Users_email_key3; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key3" UNIQUE (email);


--
-- Name: Users Users_email_key30; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key30" UNIQUE (email);


--
-- Name: Users Users_email_key31; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key31" UNIQUE (email);


--
-- Name: Users Users_email_key32; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key32" UNIQUE (email);


--
-- Name: Users Users_email_key33; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key33" UNIQUE (email);


--
-- Name: Users Users_email_key34; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key34" UNIQUE (email);


--
-- Name: Users Users_email_key35; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key35" UNIQUE (email);


--
-- Name: Users Users_email_key36; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key36" UNIQUE (email);


--
-- Name: Users Users_email_key37; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key37" UNIQUE (email);


--
-- Name: Users Users_email_key38; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key38" UNIQUE (email);


--
-- Name: Users Users_email_key39; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key39" UNIQUE (email);


--
-- Name: Users Users_email_key4; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key4" UNIQUE (email);


--
-- Name: Users Users_email_key40; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key40" UNIQUE (email);


--
-- Name: Users Users_email_key41; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key41" UNIQUE (email);


--
-- Name: Users Users_email_key42; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key42" UNIQUE (email);


--
-- Name: Users Users_email_key43; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key43" UNIQUE (email);


--
-- Name: Users Users_email_key44; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key44" UNIQUE (email);


--
-- Name: Users Users_email_key45; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key45" UNIQUE (email);


--
-- Name: Users Users_email_key46; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key46" UNIQUE (email);


--
-- Name: Users Users_email_key47; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key47" UNIQUE (email);


--
-- Name: Users Users_email_key48; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key48" UNIQUE (email);


--
-- Name: Users Users_email_key49; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key49" UNIQUE (email);


--
-- Name: Users Users_email_key5; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key5" UNIQUE (email);


--
-- Name: Users Users_email_key50; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key50" UNIQUE (email);


--
-- Name: Users Users_email_key51; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key51" UNIQUE (email);


--
-- Name: Users Users_email_key52; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key52" UNIQUE (email);


--
-- Name: Users Users_email_key53; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key53" UNIQUE (email);


--
-- Name: Users Users_email_key54; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key54" UNIQUE (email);


--
-- Name: Users Users_email_key55; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key55" UNIQUE (email);


--
-- Name: Users Users_email_key56; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key56" UNIQUE (email);


--
-- Name: Users Users_email_key57; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key57" UNIQUE (email);


--
-- Name: Users Users_email_key58; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key58" UNIQUE (email);


--
-- Name: Users Users_email_key59; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key59" UNIQUE (email);


--
-- Name: Users Users_email_key6; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key6" UNIQUE (email);


--
-- Name: Users Users_email_key60; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key60" UNIQUE (email);


--
-- Name: Users Users_email_key61; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key61" UNIQUE (email);


--
-- Name: Users Users_email_key62; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key62" UNIQUE (email);


--
-- Name: Users Users_email_key63; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key63" UNIQUE (email);


--
-- Name: Users Users_email_key64; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key64" UNIQUE (email);


--
-- Name: Users Users_email_key65; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key65" UNIQUE (email);


--
-- Name: Users Users_email_key66; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key66" UNIQUE (email);


--
-- Name: Users Users_email_key67; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key67" UNIQUE (email);


--
-- Name: Users Users_email_key68; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key68" UNIQUE (email);


--
-- Name: Users Users_email_key69; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key69" UNIQUE (email);


--
-- Name: Users Users_email_key7; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key7" UNIQUE (email);


--
-- Name: Users Users_email_key70; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key70" UNIQUE (email);


--
-- Name: Users Users_email_key71; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key71" UNIQUE (email);


--
-- Name: Users Users_email_key72; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key72" UNIQUE (email);


--
-- Name: Users Users_email_key73; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key73" UNIQUE (email);


--
-- Name: Users Users_email_key74; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key74" UNIQUE (email);


--
-- Name: Users Users_email_key75; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key75" UNIQUE (email);


--
-- Name: Users Users_email_key76; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key76" UNIQUE (email);


--
-- Name: Users Users_email_key77; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key77" UNIQUE (email);


--
-- Name: Users Users_email_key78; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key78" UNIQUE (email);


--
-- Name: Users Users_email_key79; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key79" UNIQUE (email);


--
-- Name: Users Users_email_key8; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key8" UNIQUE (email);


--
-- Name: Users Users_email_key80; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key80" UNIQUE (email);


--
-- Name: Users Users_email_key81; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key81" UNIQUE (email);


--
-- Name: Users Users_email_key82; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key82" UNIQUE (email);


--
-- Name: Users Users_email_key83; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key83" UNIQUE (email);


--
-- Name: Users Users_email_key84; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key84" UNIQUE (email);


--
-- Name: Users Users_email_key85; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key85" UNIQUE (email);


--
-- Name: Users Users_email_key86; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key86" UNIQUE (email);


--
-- Name: Users Users_email_key87; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key87" UNIQUE (email);


--
-- Name: Users Users_email_key88; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key88" UNIQUE (email);


--
-- Name: Users Users_email_key89; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key89" UNIQUE (email);


--
-- Name: Users Users_email_key9; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key9" UNIQUE (email);


--
-- Name: Users Users_email_key90; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key90" UNIQUE (email);


--
-- Name: Users Users_email_key91; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key91" UNIQUE (email);


--
-- Name: Users Users_email_key92; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key92" UNIQUE (email);


--
-- Name: Users Users_email_key93; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key93" UNIQUE (email);


--
-- Name: Users Users_email_key94; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key94" UNIQUE (email);


--
-- Name: Users Users_email_key95; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key95" UNIQUE (email);


--
-- Name: Users Users_email_key96; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key96" UNIQUE (email);


--
-- Name: Users Users_email_key97; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key97" UNIQUE (email);


--
-- Name: Users Users_email_key98; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key98" UNIQUE (email);


--
-- Name: Users Users_email_key99; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key99" UNIQUE (email);


--
-- Name: Users Users_emp_no_key; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key1; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key1" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key10; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key10" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key100; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key100" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key101; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key101" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key102; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key102" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key103; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key103" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key104; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key104" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key105; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key105" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key106; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key106" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key107; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key107" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key108; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key108" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key109; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key109" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key11; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key11" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key110; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key110" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key111; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key111" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key112; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key112" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key113; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key113" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key114; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key114" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key115; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key115" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key116; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key116" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key117; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key117" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key118; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key118" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key119; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key119" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key12; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key12" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key120; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key120" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key121; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key121" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key122; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key122" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key123; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key123" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key124; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key124" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key125; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key125" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key126; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key126" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key127; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key127" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key128; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key128" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key129; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key129" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key13; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key13" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key130; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key130" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key131; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key131" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key132; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key132" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key133; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key133" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key134; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key134" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key135; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key135" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key136; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key136" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key137; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key137" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key138; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key138" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key139; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key139" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key14; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key14" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key15; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key15" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key16; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key16" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key17; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key17" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key18; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key18" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key19; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key19" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key2; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key2" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key20; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key20" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key21; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key21" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key22; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key22" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key23; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key23" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key24; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key24" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key25; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key25" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key26; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key26" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key27; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key27" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key28; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key28" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key29; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key29" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key3; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key3" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key30; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key30" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key31; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key31" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key32; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key32" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key33; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key33" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key34; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key34" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key35; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key35" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key36; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key36" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key37; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key37" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key38; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key38" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key39; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key39" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key4; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key4" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key40; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key40" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key41; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key41" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key42; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key42" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key43; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key43" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key44; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key44" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key45; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key45" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key46; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key46" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key47; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key47" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key48; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key48" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key49; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key49" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key5; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key5" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key50; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key50" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key51; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key51" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key52; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key52" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key53; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key53" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key54; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key54" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key55; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key55" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key56; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key56" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key57; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key57" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key58; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key58" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key59; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key59" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key6; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key6" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key60; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key60" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key61; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key61" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key62; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key62" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key63; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key63" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key64; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key64" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key65; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key65" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key66; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key66" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key67; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key67" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key68; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key68" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key69; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key69" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key7; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key7" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key70; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key70" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key71; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key71" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key72; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key72" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key73; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key73" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key74; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key74" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key75; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key75" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key76; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key76" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key77; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key77" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key78; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key78" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key79; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key79" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key8; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key8" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key80; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key80" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key81; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key81" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key82; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key82" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key83; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key83" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key84; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key84" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key85; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key85" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key86; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key86" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key87; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key87" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key88; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key88" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key89; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key89" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key9; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key9" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key90; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key90" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key91; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key91" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key92; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key92" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key93; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key93" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key94; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key94" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key95; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key95" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key96; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key96" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key97; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key97" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key98; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key98" UNIQUE (emp_no);


--
-- Name: Users Users_emp_no_key99; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key99" UNIQUE (emp_no);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: company company_companyName_key; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1" UNIQUE ("companyName");


--
-- Name: company company_companyName_key10; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key10" UNIQUE ("companyName");


--
-- Name: company company_companyName_key100; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key100" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1000; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1000" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1001; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1001" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1002; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1002" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1003; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1003" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1004; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1004" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1005; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1005" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1006; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1006" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1007; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1007" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1008; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1008" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1009; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1009" UNIQUE ("companyName");


--
-- Name: company company_companyName_key101; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key101" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1010; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1010" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1011; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1011" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1012; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1012" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1013; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1013" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1014; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1014" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1015; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1015" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1016; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1016" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1017; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1017" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1018; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1018" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1019; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1019" UNIQUE ("companyName");


--
-- Name: company company_companyName_key102; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key102" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1020; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1020" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1021; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1021" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1022; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1022" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1023; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1023" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1024; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1024" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1025; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1025" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1026; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1026" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1027; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1027" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1028; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1028" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1029; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1029" UNIQUE ("companyName");


--
-- Name: company company_companyName_key103; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key103" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1030; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1030" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1031; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1031" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1032; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1032" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1033; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1033" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1034; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1034" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1035; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1035" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1036; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1036" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1037; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1037" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1038; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1038" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1039; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1039" UNIQUE ("companyName");


--
-- Name: company company_companyName_key104; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key104" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1040; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1040" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1041; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1041" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1042; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1042" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1043; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1043" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1044; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1044" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1045; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1045" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1046; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1046" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1047; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1047" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1048; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1048" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1049; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1049" UNIQUE ("companyName");


--
-- Name: company company_companyName_key105; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key105" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1050; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1050" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1051; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1051" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1052; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1052" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1053; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1053" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1054; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1054" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1055; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1055" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1056; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1056" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1057; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1057" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1058; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1058" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1059; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1059" UNIQUE ("companyName");


--
-- Name: company company_companyName_key106; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key106" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1060; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1060" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1061; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1061" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1062; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1062" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1063; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1063" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1064; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1064" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1065; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1065" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1066; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1066" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1067; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1067" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1068; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1068" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1069; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1069" UNIQUE ("companyName");


--
-- Name: company company_companyName_key107; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key107" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1070; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1070" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1071; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1071" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1072; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1072" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1073; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1073" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1074; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1074" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1075; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1075" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1076; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1076" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1077; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1077" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1078; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1078" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1079; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1079" UNIQUE ("companyName");


--
-- Name: company company_companyName_key108; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key108" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1080; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1080" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1081; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1081" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1082; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1082" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1083; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1083" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1084; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1084" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1085; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1085" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1086; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1086" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1087; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1087" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1088; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1088" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1089; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1089" UNIQUE ("companyName");


--
-- Name: company company_companyName_key109; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key109" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1090; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1090" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1091; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1091" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1092; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1092" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1093; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1093" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1094; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1094" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1095; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1095" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1096; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1096" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1097; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1097" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1098; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1098" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1099; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1099" UNIQUE ("companyName");


--
-- Name: company company_companyName_key11; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key11" UNIQUE ("companyName");


--
-- Name: company company_companyName_key110; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key110" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1100; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1100" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1101; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1101" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1102; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1102" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1103; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1103" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1104; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1104" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1105; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1105" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1106; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1106" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1107; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1107" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1108; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1108" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1109; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1109" UNIQUE ("companyName");


--
-- Name: company company_companyName_key111; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key111" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1110; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1110" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1111; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1111" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1112; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1112" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1113; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1113" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1114; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1114" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1115; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1115" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1116; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1116" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1117; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1117" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1118; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1118" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1119; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1119" UNIQUE ("companyName");


--
-- Name: company company_companyName_key112; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key112" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1120; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1120" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1121; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1121" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1122; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1122" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1123; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1123" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1124; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1124" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1125; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1125" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1126; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1126" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1127; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1127" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1128; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1128" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1129; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1129" UNIQUE ("companyName");


--
-- Name: company company_companyName_key113; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key113" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1130; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1130" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1131; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1131" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1132; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1132" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1133; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1133" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1134; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1134" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1135; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1135" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1136; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1136" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1137; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1137" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1138; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1138" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1139; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1139" UNIQUE ("companyName");


--
-- Name: company company_companyName_key114; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key114" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1140; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1140" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1141; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1141" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1142; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1142" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1143; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1143" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1144; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1144" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1145; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1145" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1146; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1146" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1147; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1147" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1148; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1148" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1149; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1149" UNIQUE ("companyName");


--
-- Name: company company_companyName_key115; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key115" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1150; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1150" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1151; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1151" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1152; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1152" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1153; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1153" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1154; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1154" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1155; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1155" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1156; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1156" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1157; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1157" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1158; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1158" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1159; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1159" UNIQUE ("companyName");


--
-- Name: company company_companyName_key116; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key116" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1160; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1160" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1161; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1161" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1162; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1162" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1163; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1163" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1164; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1164" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1165; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1165" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1166; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1166" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1167; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1167" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1168; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1168" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1169; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1169" UNIQUE ("companyName");


--
-- Name: company company_companyName_key117; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key117" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1170; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1170" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1171; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1171" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1172; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1172" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1173; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1173" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1174; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1174" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1175; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1175" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1176; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1176" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1177; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1177" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1178; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1178" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1179; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1179" UNIQUE ("companyName");


--
-- Name: company company_companyName_key118; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key118" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1180; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1180" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1181; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1181" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1182; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1182" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1183; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1183" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1184; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1184" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1185; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1185" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1186; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1186" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1187; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1187" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1188; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1188" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1189; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1189" UNIQUE ("companyName");


--
-- Name: company company_companyName_key119; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key119" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1190; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1190" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1191; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1191" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1192; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1192" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1193; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1193" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1194; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1194" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1195; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1195" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1196; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1196" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1197; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1197" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1198; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1198" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1199; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1199" UNIQUE ("companyName");


--
-- Name: company company_companyName_key12; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key12" UNIQUE ("companyName");


--
-- Name: company company_companyName_key120; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key120" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1200; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1200" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1201; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1201" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1202; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1202" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1203; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1203" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1204; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1204" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1205; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1205" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1206; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1206" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1207; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1207" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1208; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1208" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1209; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1209" UNIQUE ("companyName");


--
-- Name: company company_companyName_key121; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key121" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1210; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1210" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1211; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1211" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1212; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1212" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1213; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1213" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1214; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1214" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1215; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1215" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1216; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1216" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1217; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1217" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1218; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1218" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1219; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1219" UNIQUE ("companyName");


--
-- Name: company company_companyName_key122; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key122" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1220; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1220" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1221; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1221" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1222; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1222" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1223; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1223" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1224; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1224" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1225; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1225" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1226; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1226" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1227; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1227" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1228; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1228" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1229; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1229" UNIQUE ("companyName");


--
-- Name: company company_companyName_key123; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key123" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1230; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1230" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1231; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1231" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1232; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1232" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1233; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1233" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1234; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1234" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1235; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1235" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1236; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1236" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1237; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1237" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1238; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1238" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1239; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1239" UNIQUE ("companyName");


--
-- Name: company company_companyName_key124; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key124" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1240; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1240" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1241; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1241" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1242; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1242" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1243; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1243" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1244; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1244" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1245; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1245" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1246; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1246" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1247; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1247" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1248; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1248" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1249; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1249" UNIQUE ("companyName");


--
-- Name: company company_companyName_key125; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key125" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1250; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1250" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1251; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1251" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1252; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1252" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1253; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1253" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1254; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1254" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1255; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1255" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1256; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1256" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1257; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1257" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1258; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1258" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1259; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1259" UNIQUE ("companyName");


--
-- Name: company company_companyName_key126; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key126" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1260; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1260" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1261; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1261" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1262; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1262" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1263; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1263" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1264; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1264" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1265; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1265" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1266; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1266" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1267; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1267" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1268; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1268" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1269; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1269" UNIQUE ("companyName");


--
-- Name: company company_companyName_key127; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key127" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1270; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1270" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1271; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1271" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1272; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1272" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1273; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1273" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1274; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1274" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1275; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1275" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1276; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1276" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1277; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1277" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1278; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1278" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1279; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1279" UNIQUE ("companyName");


--
-- Name: company company_companyName_key128; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key128" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1280; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1280" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1281; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1281" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1282; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1282" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1283; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1283" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1284; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1284" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1285; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1285" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1286; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1286" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1287; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1287" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1288; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1288" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1289; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1289" UNIQUE ("companyName");


--
-- Name: company company_companyName_key129; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key129" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1290; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1290" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1291; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1291" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1292; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1292" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1293; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1293" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1294; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1294" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1295; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1295" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1296; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1296" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1297; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1297" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1298; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1298" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1299; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1299" UNIQUE ("companyName");


--
-- Name: company company_companyName_key13; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key13" UNIQUE ("companyName");


--
-- Name: company company_companyName_key130; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key130" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1300; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1300" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1301; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1301" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1302; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1302" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1303; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1303" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1304; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1304" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1305; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1305" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1306; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1306" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1307; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1307" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1308; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1308" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1309; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1309" UNIQUE ("companyName");


--
-- Name: company company_companyName_key131; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key131" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1310; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1310" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1311; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1311" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1312; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1312" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1313; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1313" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1314; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1314" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1315; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1315" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1316; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1316" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1317; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1317" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1318; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1318" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1319; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1319" UNIQUE ("companyName");


--
-- Name: company company_companyName_key132; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key132" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1320; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1320" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1321; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1321" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1322; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1322" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1323; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1323" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1324; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1324" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1325; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1325" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1326; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1326" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1327; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1327" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1328; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1328" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1329; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1329" UNIQUE ("companyName");


--
-- Name: company company_companyName_key133; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key133" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1330; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1330" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1331; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1331" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1332; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1332" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1333; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1333" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1334; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1334" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1335; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1335" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1336; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1336" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1337; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1337" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1338; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1338" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1339; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1339" UNIQUE ("companyName");


--
-- Name: company company_companyName_key134; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key134" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1340; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1340" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1341; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1341" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1342; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1342" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1343; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1343" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1344; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1344" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1345; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1345" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1346; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1346" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1347; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1347" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1348; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1348" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1349; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1349" UNIQUE ("companyName");


--
-- Name: company company_companyName_key135; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key135" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1350; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1350" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1351; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1351" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1352; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1352" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1353; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1353" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1354; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1354" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1355; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1355" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1356; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1356" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1357; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1357" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1358; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1358" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1359; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1359" UNIQUE ("companyName");


--
-- Name: company company_companyName_key136; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key136" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1360; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1360" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1361; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1361" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1362; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1362" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1363; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1363" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1364; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1364" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1365; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1365" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1366; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1366" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1367; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1367" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1368; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1368" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1369; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1369" UNIQUE ("companyName");


--
-- Name: company company_companyName_key137; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key137" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1370; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1370" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1371; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1371" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1372; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1372" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1373; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1373" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1374; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1374" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1375; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1375" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1376; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1376" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1377; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1377" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1378; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1378" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1379; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1379" UNIQUE ("companyName");


--
-- Name: company company_companyName_key138; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key138" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1380; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1380" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1381; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1381" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1382; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1382" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1383; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1383" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1384; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1384" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1385; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1385" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1386; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1386" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1387; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1387" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1388; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1388" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1389; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1389" UNIQUE ("companyName");


--
-- Name: company company_companyName_key139; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key139" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1390; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1390" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1391; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1391" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1392; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1392" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1393; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1393" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1394; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1394" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1395; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1395" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1396; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1396" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1397; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1397" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1398; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1398" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1399; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1399" UNIQUE ("companyName");


--
-- Name: company company_companyName_key14; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key14" UNIQUE ("companyName");


--
-- Name: company company_companyName_key140; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key140" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1400; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1400" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1401; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1401" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1402; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1402" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1403; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1403" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1404; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1404" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1405; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1405" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1406; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1406" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1407; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1407" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1408; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1408" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1409; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1409" UNIQUE ("companyName");


--
-- Name: company company_companyName_key141; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key141" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1410; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1410" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1411; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1411" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1412; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1412" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1413; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1413" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1414; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1414" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1415; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1415" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1416; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1416" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1417; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1417" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1418; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1418" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1419; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1419" UNIQUE ("companyName");


--
-- Name: company company_companyName_key142; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key142" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1420; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1420" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1421; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1421" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1422; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1422" UNIQUE ("companyName");


--
-- Name: company company_companyName_key1423; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key1423" UNIQUE ("companyName");


--
-- Name: company company_companyName_key143; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key143" UNIQUE ("companyName");


--
-- Name: company company_companyName_key144; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key144" UNIQUE ("companyName");


--
-- Name: company company_companyName_key145; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key145" UNIQUE ("companyName");


--
-- Name: company company_companyName_key146; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key146" UNIQUE ("companyName");


--
-- Name: company company_companyName_key147; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key147" UNIQUE ("companyName");


--
-- Name: company company_companyName_key148; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key148" UNIQUE ("companyName");


--
-- Name: company company_companyName_key149; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key149" UNIQUE ("companyName");


--
-- Name: company company_companyName_key15; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key15" UNIQUE ("companyName");


--
-- Name: company company_companyName_key150; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key150" UNIQUE ("companyName");


--
-- Name: company company_companyName_key151; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key151" UNIQUE ("companyName");


--
-- Name: company company_companyName_key152; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key152" UNIQUE ("companyName");


--
-- Name: company company_companyName_key153; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key153" UNIQUE ("companyName");


--
-- Name: company company_companyName_key154; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key154" UNIQUE ("companyName");


--
-- Name: company company_companyName_key155; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key155" UNIQUE ("companyName");


--
-- Name: company company_companyName_key156; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key156" UNIQUE ("companyName");


--
-- Name: company company_companyName_key157; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key157" UNIQUE ("companyName");


--
-- Name: company company_companyName_key158; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key158" UNIQUE ("companyName");


--
-- Name: company company_companyName_key159; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key159" UNIQUE ("companyName");


--
-- Name: company company_companyName_key16; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key16" UNIQUE ("companyName");


--
-- Name: company company_companyName_key160; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key160" UNIQUE ("companyName");


--
-- Name: company company_companyName_key161; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key161" UNIQUE ("companyName");


--
-- Name: company company_companyName_key162; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key162" UNIQUE ("companyName");


--
-- Name: company company_companyName_key163; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key163" UNIQUE ("companyName");


--
-- Name: company company_companyName_key164; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key164" UNIQUE ("companyName");


--
-- Name: company company_companyName_key165; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key165" UNIQUE ("companyName");


--
-- Name: company company_companyName_key166; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key166" UNIQUE ("companyName");


--
-- Name: company company_companyName_key167; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key167" UNIQUE ("companyName");


--
-- Name: company company_companyName_key168; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key168" UNIQUE ("companyName");


--
-- Name: company company_companyName_key169; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key169" UNIQUE ("companyName");


--
-- Name: company company_companyName_key17; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key17" UNIQUE ("companyName");


--
-- Name: company company_companyName_key170; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key170" UNIQUE ("companyName");


--
-- Name: company company_companyName_key171; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key171" UNIQUE ("companyName");


--
-- Name: company company_companyName_key172; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key172" UNIQUE ("companyName");


--
-- Name: company company_companyName_key173; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key173" UNIQUE ("companyName");


--
-- Name: company company_companyName_key174; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key174" UNIQUE ("companyName");


--
-- Name: company company_companyName_key175; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key175" UNIQUE ("companyName");


--
-- Name: company company_companyName_key176; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key176" UNIQUE ("companyName");


--
-- Name: company company_companyName_key177; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key177" UNIQUE ("companyName");


--
-- Name: company company_companyName_key178; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key178" UNIQUE ("companyName");


--
-- Name: company company_companyName_key179; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key179" UNIQUE ("companyName");


--
-- Name: company company_companyName_key18; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key18" UNIQUE ("companyName");


--
-- Name: company company_companyName_key180; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key180" UNIQUE ("companyName");


--
-- Name: company company_companyName_key181; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key181" UNIQUE ("companyName");


--
-- Name: company company_companyName_key182; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key182" UNIQUE ("companyName");


--
-- Name: company company_companyName_key183; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key183" UNIQUE ("companyName");


--
-- Name: company company_companyName_key184; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key184" UNIQUE ("companyName");


--
-- Name: company company_companyName_key185; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key185" UNIQUE ("companyName");


--
-- Name: company company_companyName_key186; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key186" UNIQUE ("companyName");


--
-- Name: company company_companyName_key187; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key187" UNIQUE ("companyName");


--
-- Name: company company_companyName_key188; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key188" UNIQUE ("companyName");


--
-- Name: company company_companyName_key189; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key189" UNIQUE ("companyName");


--
-- Name: company company_companyName_key19; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key19" UNIQUE ("companyName");


--
-- Name: company company_companyName_key190; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key190" UNIQUE ("companyName");


--
-- Name: company company_companyName_key191; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key191" UNIQUE ("companyName");


--
-- Name: company company_companyName_key192; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key192" UNIQUE ("companyName");


--
-- Name: company company_companyName_key193; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key193" UNIQUE ("companyName");


--
-- Name: company company_companyName_key194; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key194" UNIQUE ("companyName");


--
-- Name: company company_companyName_key195; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key195" UNIQUE ("companyName");


--
-- Name: company company_companyName_key196; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key196" UNIQUE ("companyName");


--
-- Name: company company_companyName_key197; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key197" UNIQUE ("companyName");


--
-- Name: company company_companyName_key198; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key198" UNIQUE ("companyName");


--
-- Name: company company_companyName_key199; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key199" UNIQUE ("companyName");


--
-- Name: company company_companyName_key2; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key2" UNIQUE ("companyName");


--
-- Name: company company_companyName_key20; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key20" UNIQUE ("companyName");


--
-- Name: company company_companyName_key200; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key200" UNIQUE ("companyName");


--
-- Name: company company_companyName_key201; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key201" UNIQUE ("companyName");


--
-- Name: company company_companyName_key202; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key202" UNIQUE ("companyName");


--
-- Name: company company_companyName_key203; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key203" UNIQUE ("companyName");


--
-- Name: company company_companyName_key204; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key204" UNIQUE ("companyName");


--
-- Name: company company_companyName_key205; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key205" UNIQUE ("companyName");


--
-- Name: company company_companyName_key206; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key206" UNIQUE ("companyName");


--
-- Name: company company_companyName_key207; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key207" UNIQUE ("companyName");


--
-- Name: company company_companyName_key208; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key208" UNIQUE ("companyName");


--
-- Name: company company_companyName_key209; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key209" UNIQUE ("companyName");


--
-- Name: company company_companyName_key21; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key21" UNIQUE ("companyName");


--
-- Name: company company_companyName_key210; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key210" UNIQUE ("companyName");


--
-- Name: company company_companyName_key211; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key211" UNIQUE ("companyName");


--
-- Name: company company_companyName_key212; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key212" UNIQUE ("companyName");


--
-- Name: company company_companyName_key213; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key213" UNIQUE ("companyName");


--
-- Name: company company_companyName_key214; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key214" UNIQUE ("companyName");


--
-- Name: company company_companyName_key215; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key215" UNIQUE ("companyName");


--
-- Name: company company_companyName_key216; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key216" UNIQUE ("companyName");


--
-- Name: company company_companyName_key217; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key217" UNIQUE ("companyName");


--
-- Name: company company_companyName_key218; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key218" UNIQUE ("companyName");


--
-- Name: company company_companyName_key219; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key219" UNIQUE ("companyName");


--
-- Name: company company_companyName_key22; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key22" UNIQUE ("companyName");


--
-- Name: company company_companyName_key220; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key220" UNIQUE ("companyName");


--
-- Name: company company_companyName_key221; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key221" UNIQUE ("companyName");


--
-- Name: company company_companyName_key222; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key222" UNIQUE ("companyName");


--
-- Name: company company_companyName_key223; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key223" UNIQUE ("companyName");


--
-- Name: company company_companyName_key224; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key224" UNIQUE ("companyName");


--
-- Name: company company_companyName_key225; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key225" UNIQUE ("companyName");


--
-- Name: company company_companyName_key226; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key226" UNIQUE ("companyName");


--
-- Name: company company_companyName_key227; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key227" UNIQUE ("companyName");


--
-- Name: company company_companyName_key228; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key228" UNIQUE ("companyName");


--
-- Name: company company_companyName_key229; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key229" UNIQUE ("companyName");


--
-- Name: company company_companyName_key23; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key23" UNIQUE ("companyName");


--
-- Name: company company_companyName_key230; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key230" UNIQUE ("companyName");


--
-- Name: company company_companyName_key231; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key231" UNIQUE ("companyName");


--
-- Name: company company_companyName_key232; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key232" UNIQUE ("companyName");


--
-- Name: company company_companyName_key233; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key233" UNIQUE ("companyName");


--
-- Name: company company_companyName_key234; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key234" UNIQUE ("companyName");


--
-- Name: company company_companyName_key235; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key235" UNIQUE ("companyName");


--
-- Name: company company_companyName_key236; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key236" UNIQUE ("companyName");


--
-- Name: company company_companyName_key237; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key237" UNIQUE ("companyName");


--
-- Name: company company_companyName_key238; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key238" UNIQUE ("companyName");


--
-- Name: company company_companyName_key239; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key239" UNIQUE ("companyName");


--
-- Name: company company_companyName_key24; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key24" UNIQUE ("companyName");


--
-- Name: company company_companyName_key240; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key240" UNIQUE ("companyName");


--
-- Name: company company_companyName_key241; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key241" UNIQUE ("companyName");


--
-- Name: company company_companyName_key242; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key242" UNIQUE ("companyName");


--
-- Name: company company_companyName_key243; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key243" UNIQUE ("companyName");


--
-- Name: company company_companyName_key244; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key244" UNIQUE ("companyName");


--
-- Name: company company_companyName_key245; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key245" UNIQUE ("companyName");


--
-- Name: company company_companyName_key246; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key246" UNIQUE ("companyName");


--
-- Name: company company_companyName_key247; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key247" UNIQUE ("companyName");


--
-- Name: company company_companyName_key248; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key248" UNIQUE ("companyName");


--
-- Name: company company_companyName_key249; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key249" UNIQUE ("companyName");


--
-- Name: company company_companyName_key25; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key25" UNIQUE ("companyName");


--
-- Name: company company_companyName_key250; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key250" UNIQUE ("companyName");


--
-- Name: company company_companyName_key251; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key251" UNIQUE ("companyName");


--
-- Name: company company_companyName_key252; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key252" UNIQUE ("companyName");


--
-- Name: company company_companyName_key253; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key253" UNIQUE ("companyName");


--
-- Name: company company_companyName_key254; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key254" UNIQUE ("companyName");


--
-- Name: company company_companyName_key255; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key255" UNIQUE ("companyName");


--
-- Name: company company_companyName_key256; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key256" UNIQUE ("companyName");


--
-- Name: company company_companyName_key257; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key257" UNIQUE ("companyName");


--
-- Name: company company_companyName_key258; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key258" UNIQUE ("companyName");


--
-- Name: company company_companyName_key259; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key259" UNIQUE ("companyName");


--
-- Name: company company_companyName_key26; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key26" UNIQUE ("companyName");


--
-- Name: company company_companyName_key260; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key260" UNIQUE ("companyName");


--
-- Name: company company_companyName_key261; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key261" UNIQUE ("companyName");


--
-- Name: company company_companyName_key262; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key262" UNIQUE ("companyName");


--
-- Name: company company_companyName_key263; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key263" UNIQUE ("companyName");


--
-- Name: company company_companyName_key264; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key264" UNIQUE ("companyName");


--
-- Name: company company_companyName_key265; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key265" UNIQUE ("companyName");


--
-- Name: company company_companyName_key266; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key266" UNIQUE ("companyName");


--
-- Name: company company_companyName_key267; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key267" UNIQUE ("companyName");


--
-- Name: company company_companyName_key268; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key268" UNIQUE ("companyName");


--
-- Name: company company_companyName_key269; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key269" UNIQUE ("companyName");


--
-- Name: company company_companyName_key27; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key27" UNIQUE ("companyName");


--
-- Name: company company_companyName_key270; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key270" UNIQUE ("companyName");


--
-- Name: company company_companyName_key271; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key271" UNIQUE ("companyName");


--
-- Name: company company_companyName_key272; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key272" UNIQUE ("companyName");


--
-- Name: company company_companyName_key273; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key273" UNIQUE ("companyName");


--
-- Name: company company_companyName_key274; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key274" UNIQUE ("companyName");


--
-- Name: company company_companyName_key275; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key275" UNIQUE ("companyName");


--
-- Name: company company_companyName_key276; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key276" UNIQUE ("companyName");


--
-- Name: company company_companyName_key277; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key277" UNIQUE ("companyName");


--
-- Name: company company_companyName_key278; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key278" UNIQUE ("companyName");


--
-- Name: company company_companyName_key279; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key279" UNIQUE ("companyName");


--
-- Name: company company_companyName_key28; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key28" UNIQUE ("companyName");


--
-- Name: company company_companyName_key280; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key280" UNIQUE ("companyName");


--
-- Name: company company_companyName_key281; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key281" UNIQUE ("companyName");


--
-- Name: company company_companyName_key282; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key282" UNIQUE ("companyName");


--
-- Name: company company_companyName_key283; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key283" UNIQUE ("companyName");


--
-- Name: company company_companyName_key284; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key284" UNIQUE ("companyName");


--
-- Name: company company_companyName_key285; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key285" UNIQUE ("companyName");


--
-- Name: company company_companyName_key286; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key286" UNIQUE ("companyName");


--
-- Name: company company_companyName_key287; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key287" UNIQUE ("companyName");


--
-- Name: company company_companyName_key288; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key288" UNIQUE ("companyName");


--
-- Name: company company_companyName_key289; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key289" UNIQUE ("companyName");


--
-- Name: company company_companyName_key29; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key29" UNIQUE ("companyName");


--
-- Name: company company_companyName_key290; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key290" UNIQUE ("companyName");


--
-- Name: company company_companyName_key291; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key291" UNIQUE ("companyName");


--
-- Name: company company_companyName_key292; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key292" UNIQUE ("companyName");


--
-- Name: company company_companyName_key293; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key293" UNIQUE ("companyName");


--
-- Name: company company_companyName_key294; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key294" UNIQUE ("companyName");


--
-- Name: company company_companyName_key295; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key295" UNIQUE ("companyName");


--
-- Name: company company_companyName_key296; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key296" UNIQUE ("companyName");


--
-- Name: company company_companyName_key297; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key297" UNIQUE ("companyName");


--
-- Name: company company_companyName_key298; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key298" UNIQUE ("companyName");


--
-- Name: company company_companyName_key299; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key299" UNIQUE ("companyName");


--
-- Name: company company_companyName_key3; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key3" UNIQUE ("companyName");


--
-- Name: company company_companyName_key30; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key30" UNIQUE ("companyName");


--
-- Name: company company_companyName_key300; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key300" UNIQUE ("companyName");


--
-- Name: company company_companyName_key301; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key301" UNIQUE ("companyName");


--
-- Name: company company_companyName_key302; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key302" UNIQUE ("companyName");


--
-- Name: company company_companyName_key303; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key303" UNIQUE ("companyName");


--
-- Name: company company_companyName_key304; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key304" UNIQUE ("companyName");


--
-- Name: company company_companyName_key305; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key305" UNIQUE ("companyName");


--
-- Name: company company_companyName_key306; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key306" UNIQUE ("companyName");


--
-- Name: company company_companyName_key307; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key307" UNIQUE ("companyName");


--
-- Name: company company_companyName_key308; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key308" UNIQUE ("companyName");


--
-- Name: company company_companyName_key309; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key309" UNIQUE ("companyName");


--
-- Name: company company_companyName_key31; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key31" UNIQUE ("companyName");


--
-- Name: company company_companyName_key310; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key310" UNIQUE ("companyName");


--
-- Name: company company_companyName_key311; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key311" UNIQUE ("companyName");


--
-- Name: company company_companyName_key312; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key312" UNIQUE ("companyName");


--
-- Name: company company_companyName_key313; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key313" UNIQUE ("companyName");


--
-- Name: company company_companyName_key314; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key314" UNIQUE ("companyName");


--
-- Name: company company_companyName_key315; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key315" UNIQUE ("companyName");


--
-- Name: company company_companyName_key316; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key316" UNIQUE ("companyName");


--
-- Name: company company_companyName_key317; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key317" UNIQUE ("companyName");


--
-- Name: company company_companyName_key318; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key318" UNIQUE ("companyName");


--
-- Name: company company_companyName_key319; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key319" UNIQUE ("companyName");


--
-- Name: company company_companyName_key32; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key32" UNIQUE ("companyName");


--
-- Name: company company_companyName_key320; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key320" UNIQUE ("companyName");


--
-- Name: company company_companyName_key321; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key321" UNIQUE ("companyName");


--
-- Name: company company_companyName_key322; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key322" UNIQUE ("companyName");


--
-- Name: company company_companyName_key323; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key323" UNIQUE ("companyName");


--
-- Name: company company_companyName_key324; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key324" UNIQUE ("companyName");


--
-- Name: company company_companyName_key325; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key325" UNIQUE ("companyName");


--
-- Name: company company_companyName_key326; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key326" UNIQUE ("companyName");


--
-- Name: company company_companyName_key327; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key327" UNIQUE ("companyName");


--
-- Name: company company_companyName_key328; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key328" UNIQUE ("companyName");


--
-- Name: company company_companyName_key329; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key329" UNIQUE ("companyName");


--
-- Name: company company_companyName_key33; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key33" UNIQUE ("companyName");


--
-- Name: company company_companyName_key330; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key330" UNIQUE ("companyName");


--
-- Name: company company_companyName_key331; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key331" UNIQUE ("companyName");


--
-- Name: company company_companyName_key332; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key332" UNIQUE ("companyName");


--
-- Name: company company_companyName_key333; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key333" UNIQUE ("companyName");


--
-- Name: company company_companyName_key334; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key334" UNIQUE ("companyName");


--
-- Name: company company_companyName_key335; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key335" UNIQUE ("companyName");


--
-- Name: company company_companyName_key336; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key336" UNIQUE ("companyName");


--
-- Name: company company_companyName_key337; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key337" UNIQUE ("companyName");


--
-- Name: company company_companyName_key338; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key338" UNIQUE ("companyName");


--
-- Name: company company_companyName_key339; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key339" UNIQUE ("companyName");


--
-- Name: company company_companyName_key34; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key34" UNIQUE ("companyName");


--
-- Name: company company_companyName_key340; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key340" UNIQUE ("companyName");


--
-- Name: company company_companyName_key341; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key341" UNIQUE ("companyName");


--
-- Name: company company_companyName_key342; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key342" UNIQUE ("companyName");


--
-- Name: company company_companyName_key343; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key343" UNIQUE ("companyName");


--
-- Name: company company_companyName_key344; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key344" UNIQUE ("companyName");


--
-- Name: company company_companyName_key345; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key345" UNIQUE ("companyName");


--
-- Name: company company_companyName_key346; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key346" UNIQUE ("companyName");


--
-- Name: company company_companyName_key347; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key347" UNIQUE ("companyName");


--
-- Name: company company_companyName_key348; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key348" UNIQUE ("companyName");


--
-- Name: company company_companyName_key349; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key349" UNIQUE ("companyName");


--
-- Name: company company_companyName_key35; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key35" UNIQUE ("companyName");


--
-- Name: company company_companyName_key350; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key350" UNIQUE ("companyName");


--
-- Name: company company_companyName_key351; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key351" UNIQUE ("companyName");


--
-- Name: company company_companyName_key352; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key352" UNIQUE ("companyName");


--
-- Name: company company_companyName_key353; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key353" UNIQUE ("companyName");


--
-- Name: company company_companyName_key354; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key354" UNIQUE ("companyName");


--
-- Name: company company_companyName_key355; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key355" UNIQUE ("companyName");


--
-- Name: company company_companyName_key356; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key356" UNIQUE ("companyName");


--
-- Name: company company_companyName_key357; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key357" UNIQUE ("companyName");


--
-- Name: company company_companyName_key358; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key358" UNIQUE ("companyName");


--
-- Name: company company_companyName_key359; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key359" UNIQUE ("companyName");


--
-- Name: company company_companyName_key36; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key36" UNIQUE ("companyName");


--
-- Name: company company_companyName_key360; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key360" UNIQUE ("companyName");


--
-- Name: company company_companyName_key361; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key361" UNIQUE ("companyName");


--
-- Name: company company_companyName_key362; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key362" UNIQUE ("companyName");


--
-- Name: company company_companyName_key363; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key363" UNIQUE ("companyName");


--
-- Name: company company_companyName_key364; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key364" UNIQUE ("companyName");


--
-- Name: company company_companyName_key365; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key365" UNIQUE ("companyName");


--
-- Name: company company_companyName_key366; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key366" UNIQUE ("companyName");


--
-- Name: company company_companyName_key367; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key367" UNIQUE ("companyName");


--
-- Name: company company_companyName_key368; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key368" UNIQUE ("companyName");


--
-- Name: company company_companyName_key369; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key369" UNIQUE ("companyName");


--
-- Name: company company_companyName_key37; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key37" UNIQUE ("companyName");


--
-- Name: company company_companyName_key370; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key370" UNIQUE ("companyName");


--
-- Name: company company_companyName_key371; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key371" UNIQUE ("companyName");


--
-- Name: company company_companyName_key372; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key372" UNIQUE ("companyName");


--
-- Name: company company_companyName_key373; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key373" UNIQUE ("companyName");


--
-- Name: company company_companyName_key374; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key374" UNIQUE ("companyName");


--
-- Name: company company_companyName_key375; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key375" UNIQUE ("companyName");


--
-- Name: company company_companyName_key376; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key376" UNIQUE ("companyName");


--
-- Name: company company_companyName_key377; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key377" UNIQUE ("companyName");


--
-- Name: company company_companyName_key378; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key378" UNIQUE ("companyName");


--
-- Name: company company_companyName_key379; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key379" UNIQUE ("companyName");


--
-- Name: company company_companyName_key38; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key38" UNIQUE ("companyName");


--
-- Name: company company_companyName_key380; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key380" UNIQUE ("companyName");


--
-- Name: company company_companyName_key381; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key381" UNIQUE ("companyName");


--
-- Name: company company_companyName_key382; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key382" UNIQUE ("companyName");


--
-- Name: company company_companyName_key383; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key383" UNIQUE ("companyName");


--
-- Name: company company_companyName_key384; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key384" UNIQUE ("companyName");


--
-- Name: company company_companyName_key385; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key385" UNIQUE ("companyName");


--
-- Name: company company_companyName_key386; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key386" UNIQUE ("companyName");


--
-- Name: company company_companyName_key387; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key387" UNIQUE ("companyName");


--
-- Name: company company_companyName_key388; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key388" UNIQUE ("companyName");


--
-- Name: company company_companyName_key389; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key389" UNIQUE ("companyName");


--
-- Name: company company_companyName_key39; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key39" UNIQUE ("companyName");


--
-- Name: company company_companyName_key390; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key390" UNIQUE ("companyName");


--
-- Name: company company_companyName_key391; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key391" UNIQUE ("companyName");


--
-- Name: company company_companyName_key392; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key392" UNIQUE ("companyName");


--
-- Name: company company_companyName_key393; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key393" UNIQUE ("companyName");


--
-- Name: company company_companyName_key394; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key394" UNIQUE ("companyName");


--
-- Name: company company_companyName_key395; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key395" UNIQUE ("companyName");


--
-- Name: company company_companyName_key396; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key396" UNIQUE ("companyName");


--
-- Name: company company_companyName_key397; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key397" UNIQUE ("companyName");


--
-- Name: company company_companyName_key398; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key398" UNIQUE ("companyName");


--
-- Name: company company_companyName_key399; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key399" UNIQUE ("companyName");


--
-- Name: company company_companyName_key4; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key4" UNIQUE ("companyName");


--
-- Name: company company_companyName_key40; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key40" UNIQUE ("companyName");


--
-- Name: company company_companyName_key400; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key400" UNIQUE ("companyName");


--
-- Name: company company_companyName_key401; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key401" UNIQUE ("companyName");


--
-- Name: company company_companyName_key402; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key402" UNIQUE ("companyName");


--
-- Name: company company_companyName_key403; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key403" UNIQUE ("companyName");


--
-- Name: company company_companyName_key404; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key404" UNIQUE ("companyName");


--
-- Name: company company_companyName_key405; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key405" UNIQUE ("companyName");


--
-- Name: company company_companyName_key406; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key406" UNIQUE ("companyName");


--
-- Name: company company_companyName_key407; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key407" UNIQUE ("companyName");


--
-- Name: company company_companyName_key408; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key408" UNIQUE ("companyName");


--
-- Name: company company_companyName_key409; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key409" UNIQUE ("companyName");


--
-- Name: company company_companyName_key41; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key41" UNIQUE ("companyName");


--
-- Name: company company_companyName_key410; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key410" UNIQUE ("companyName");


--
-- Name: company company_companyName_key411; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key411" UNIQUE ("companyName");


--
-- Name: company company_companyName_key412; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key412" UNIQUE ("companyName");


--
-- Name: company company_companyName_key413; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key413" UNIQUE ("companyName");


--
-- Name: company company_companyName_key414; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key414" UNIQUE ("companyName");


--
-- Name: company company_companyName_key415; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key415" UNIQUE ("companyName");


--
-- Name: company company_companyName_key416; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key416" UNIQUE ("companyName");


--
-- Name: company company_companyName_key417; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key417" UNIQUE ("companyName");


--
-- Name: company company_companyName_key418; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key418" UNIQUE ("companyName");


--
-- Name: company company_companyName_key419; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key419" UNIQUE ("companyName");


--
-- Name: company company_companyName_key42; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key42" UNIQUE ("companyName");


--
-- Name: company company_companyName_key420; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key420" UNIQUE ("companyName");


--
-- Name: company company_companyName_key421; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key421" UNIQUE ("companyName");


--
-- Name: company company_companyName_key422; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key422" UNIQUE ("companyName");


--
-- Name: company company_companyName_key423; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key423" UNIQUE ("companyName");


--
-- Name: company company_companyName_key424; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key424" UNIQUE ("companyName");


--
-- Name: company company_companyName_key425; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key425" UNIQUE ("companyName");


--
-- Name: company company_companyName_key426; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key426" UNIQUE ("companyName");


--
-- Name: company company_companyName_key427; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key427" UNIQUE ("companyName");


--
-- Name: company company_companyName_key428; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key428" UNIQUE ("companyName");


--
-- Name: company company_companyName_key429; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key429" UNIQUE ("companyName");


--
-- Name: company company_companyName_key43; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key43" UNIQUE ("companyName");


--
-- Name: company company_companyName_key430; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key430" UNIQUE ("companyName");


--
-- Name: company company_companyName_key431; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key431" UNIQUE ("companyName");


--
-- Name: company company_companyName_key432; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key432" UNIQUE ("companyName");


--
-- Name: company company_companyName_key433; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key433" UNIQUE ("companyName");


--
-- Name: company company_companyName_key434; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key434" UNIQUE ("companyName");


--
-- Name: company company_companyName_key435; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key435" UNIQUE ("companyName");


--
-- Name: company company_companyName_key436; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key436" UNIQUE ("companyName");


--
-- Name: company company_companyName_key437; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key437" UNIQUE ("companyName");


--
-- Name: company company_companyName_key438; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key438" UNIQUE ("companyName");


--
-- Name: company company_companyName_key439; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key439" UNIQUE ("companyName");


--
-- Name: company company_companyName_key44; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key44" UNIQUE ("companyName");


--
-- Name: company company_companyName_key440; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key440" UNIQUE ("companyName");


--
-- Name: company company_companyName_key441; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key441" UNIQUE ("companyName");


--
-- Name: company company_companyName_key442; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key442" UNIQUE ("companyName");


--
-- Name: company company_companyName_key443; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key443" UNIQUE ("companyName");


--
-- Name: company company_companyName_key444; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key444" UNIQUE ("companyName");


--
-- Name: company company_companyName_key445; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key445" UNIQUE ("companyName");


--
-- Name: company company_companyName_key446; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key446" UNIQUE ("companyName");


--
-- Name: company company_companyName_key447; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key447" UNIQUE ("companyName");


--
-- Name: company company_companyName_key448; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key448" UNIQUE ("companyName");


--
-- Name: company company_companyName_key449; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key449" UNIQUE ("companyName");


--
-- Name: company company_companyName_key45; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key45" UNIQUE ("companyName");


--
-- Name: company company_companyName_key450; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key450" UNIQUE ("companyName");


--
-- Name: company company_companyName_key451; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key451" UNIQUE ("companyName");


--
-- Name: company company_companyName_key452; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key452" UNIQUE ("companyName");


--
-- Name: company company_companyName_key453; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key453" UNIQUE ("companyName");


--
-- Name: company company_companyName_key454; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key454" UNIQUE ("companyName");


--
-- Name: company company_companyName_key455; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key455" UNIQUE ("companyName");


--
-- Name: company company_companyName_key456; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key456" UNIQUE ("companyName");


--
-- Name: company company_companyName_key457; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key457" UNIQUE ("companyName");


--
-- Name: company company_companyName_key458; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key458" UNIQUE ("companyName");


--
-- Name: company company_companyName_key459; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key459" UNIQUE ("companyName");


--
-- Name: company company_companyName_key46; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key46" UNIQUE ("companyName");


--
-- Name: company company_companyName_key460; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key460" UNIQUE ("companyName");


--
-- Name: company company_companyName_key461; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key461" UNIQUE ("companyName");


--
-- Name: company company_companyName_key462; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key462" UNIQUE ("companyName");


--
-- Name: company company_companyName_key463; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key463" UNIQUE ("companyName");


--
-- Name: company company_companyName_key464; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key464" UNIQUE ("companyName");


--
-- Name: company company_companyName_key465; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key465" UNIQUE ("companyName");


--
-- Name: company company_companyName_key466; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key466" UNIQUE ("companyName");


--
-- Name: company company_companyName_key467; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key467" UNIQUE ("companyName");


--
-- Name: company company_companyName_key468; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key468" UNIQUE ("companyName");


--
-- Name: company company_companyName_key469; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key469" UNIQUE ("companyName");


--
-- Name: company company_companyName_key47; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key47" UNIQUE ("companyName");


--
-- Name: company company_companyName_key470; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key470" UNIQUE ("companyName");


--
-- Name: company company_companyName_key471; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key471" UNIQUE ("companyName");


--
-- Name: company company_companyName_key472; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key472" UNIQUE ("companyName");


--
-- Name: company company_companyName_key473; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key473" UNIQUE ("companyName");


--
-- Name: company company_companyName_key474; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key474" UNIQUE ("companyName");


--
-- Name: company company_companyName_key475; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key475" UNIQUE ("companyName");


--
-- Name: company company_companyName_key476; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key476" UNIQUE ("companyName");


--
-- Name: company company_companyName_key477; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key477" UNIQUE ("companyName");


--
-- Name: company company_companyName_key478; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key478" UNIQUE ("companyName");


--
-- Name: company company_companyName_key479; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key479" UNIQUE ("companyName");


--
-- Name: company company_companyName_key48; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key48" UNIQUE ("companyName");


--
-- Name: company company_companyName_key480; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key480" UNIQUE ("companyName");


--
-- Name: company company_companyName_key481; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key481" UNIQUE ("companyName");


--
-- Name: company company_companyName_key482; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key482" UNIQUE ("companyName");


--
-- Name: company company_companyName_key483; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key483" UNIQUE ("companyName");


--
-- Name: company company_companyName_key484; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key484" UNIQUE ("companyName");


--
-- Name: company company_companyName_key485; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key485" UNIQUE ("companyName");


--
-- Name: company company_companyName_key486; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key486" UNIQUE ("companyName");


--
-- Name: company company_companyName_key487; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key487" UNIQUE ("companyName");


--
-- Name: company company_companyName_key488; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key488" UNIQUE ("companyName");


--
-- Name: company company_companyName_key489; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key489" UNIQUE ("companyName");


--
-- Name: company company_companyName_key49; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key49" UNIQUE ("companyName");


--
-- Name: company company_companyName_key490; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key490" UNIQUE ("companyName");


--
-- Name: company company_companyName_key491; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key491" UNIQUE ("companyName");


--
-- Name: company company_companyName_key492; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key492" UNIQUE ("companyName");


--
-- Name: company company_companyName_key493; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key493" UNIQUE ("companyName");


--
-- Name: company company_companyName_key494; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key494" UNIQUE ("companyName");


--
-- Name: company company_companyName_key495; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key495" UNIQUE ("companyName");


--
-- Name: company company_companyName_key496; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key496" UNIQUE ("companyName");


--
-- Name: company company_companyName_key497; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key497" UNIQUE ("companyName");


--
-- Name: company company_companyName_key498; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key498" UNIQUE ("companyName");


--
-- Name: company company_companyName_key499; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key499" UNIQUE ("companyName");


--
-- Name: company company_companyName_key5; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key5" UNIQUE ("companyName");


--
-- Name: company company_companyName_key50; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key50" UNIQUE ("companyName");


--
-- Name: company company_companyName_key500; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key500" UNIQUE ("companyName");


--
-- Name: company company_companyName_key501; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key501" UNIQUE ("companyName");


--
-- Name: company company_companyName_key502; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key502" UNIQUE ("companyName");


--
-- Name: company company_companyName_key503; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key503" UNIQUE ("companyName");


--
-- Name: company company_companyName_key504; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key504" UNIQUE ("companyName");


--
-- Name: company company_companyName_key505; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key505" UNIQUE ("companyName");


--
-- Name: company company_companyName_key506; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key506" UNIQUE ("companyName");


--
-- Name: company company_companyName_key507; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key507" UNIQUE ("companyName");


--
-- Name: company company_companyName_key508; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key508" UNIQUE ("companyName");


--
-- Name: company company_companyName_key509; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key509" UNIQUE ("companyName");


--
-- Name: company company_companyName_key51; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key51" UNIQUE ("companyName");


--
-- Name: company company_companyName_key510; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key510" UNIQUE ("companyName");


--
-- Name: company company_companyName_key511; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key511" UNIQUE ("companyName");


--
-- Name: company company_companyName_key512; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key512" UNIQUE ("companyName");


--
-- Name: company company_companyName_key513; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key513" UNIQUE ("companyName");


--
-- Name: company company_companyName_key514; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key514" UNIQUE ("companyName");


--
-- Name: company company_companyName_key515; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key515" UNIQUE ("companyName");


--
-- Name: company company_companyName_key516; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key516" UNIQUE ("companyName");


--
-- Name: company company_companyName_key517; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key517" UNIQUE ("companyName");


--
-- Name: company company_companyName_key518; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key518" UNIQUE ("companyName");


--
-- Name: company company_companyName_key519; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key519" UNIQUE ("companyName");


--
-- Name: company company_companyName_key52; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key52" UNIQUE ("companyName");


--
-- Name: company company_companyName_key520; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key520" UNIQUE ("companyName");


--
-- Name: company company_companyName_key521; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key521" UNIQUE ("companyName");


--
-- Name: company company_companyName_key522; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key522" UNIQUE ("companyName");


--
-- Name: company company_companyName_key523; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key523" UNIQUE ("companyName");


--
-- Name: company company_companyName_key524; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key524" UNIQUE ("companyName");


--
-- Name: company company_companyName_key525; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key525" UNIQUE ("companyName");


--
-- Name: company company_companyName_key526; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key526" UNIQUE ("companyName");


--
-- Name: company company_companyName_key527; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key527" UNIQUE ("companyName");


--
-- Name: company company_companyName_key528; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key528" UNIQUE ("companyName");


--
-- Name: company company_companyName_key529; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key529" UNIQUE ("companyName");


--
-- Name: company company_companyName_key53; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key53" UNIQUE ("companyName");


--
-- Name: company company_companyName_key530; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key530" UNIQUE ("companyName");


--
-- Name: company company_companyName_key531; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key531" UNIQUE ("companyName");


--
-- Name: company company_companyName_key532; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key532" UNIQUE ("companyName");


--
-- Name: company company_companyName_key533; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key533" UNIQUE ("companyName");


--
-- Name: company company_companyName_key534; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key534" UNIQUE ("companyName");


--
-- Name: company company_companyName_key535; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key535" UNIQUE ("companyName");


--
-- Name: company company_companyName_key536; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key536" UNIQUE ("companyName");


--
-- Name: company company_companyName_key537; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key537" UNIQUE ("companyName");


--
-- Name: company company_companyName_key538; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key538" UNIQUE ("companyName");


--
-- Name: company company_companyName_key539; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key539" UNIQUE ("companyName");


--
-- Name: company company_companyName_key54; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key54" UNIQUE ("companyName");


--
-- Name: company company_companyName_key540; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key540" UNIQUE ("companyName");


--
-- Name: company company_companyName_key541; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key541" UNIQUE ("companyName");


--
-- Name: company company_companyName_key542; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key542" UNIQUE ("companyName");


--
-- Name: company company_companyName_key543; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key543" UNIQUE ("companyName");


--
-- Name: company company_companyName_key544; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key544" UNIQUE ("companyName");


--
-- Name: company company_companyName_key545; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key545" UNIQUE ("companyName");


--
-- Name: company company_companyName_key546; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key546" UNIQUE ("companyName");


--
-- Name: company company_companyName_key547; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key547" UNIQUE ("companyName");


--
-- Name: company company_companyName_key548; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key548" UNIQUE ("companyName");


--
-- Name: company company_companyName_key549; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key549" UNIQUE ("companyName");


--
-- Name: company company_companyName_key55; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key55" UNIQUE ("companyName");


--
-- Name: company company_companyName_key550; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key550" UNIQUE ("companyName");


--
-- Name: company company_companyName_key551; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key551" UNIQUE ("companyName");


--
-- Name: company company_companyName_key552; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key552" UNIQUE ("companyName");


--
-- Name: company company_companyName_key553; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key553" UNIQUE ("companyName");


--
-- Name: company company_companyName_key554; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key554" UNIQUE ("companyName");


--
-- Name: company company_companyName_key555; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key555" UNIQUE ("companyName");


--
-- Name: company company_companyName_key556; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key556" UNIQUE ("companyName");


--
-- Name: company company_companyName_key557; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key557" UNIQUE ("companyName");


--
-- Name: company company_companyName_key558; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key558" UNIQUE ("companyName");


--
-- Name: company company_companyName_key559; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key559" UNIQUE ("companyName");


--
-- Name: company company_companyName_key56; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key56" UNIQUE ("companyName");


--
-- Name: company company_companyName_key560; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key560" UNIQUE ("companyName");


--
-- Name: company company_companyName_key561; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key561" UNIQUE ("companyName");


--
-- Name: company company_companyName_key562; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key562" UNIQUE ("companyName");


--
-- Name: company company_companyName_key563; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key563" UNIQUE ("companyName");


--
-- Name: company company_companyName_key564; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key564" UNIQUE ("companyName");


--
-- Name: company company_companyName_key565; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key565" UNIQUE ("companyName");


--
-- Name: company company_companyName_key566; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key566" UNIQUE ("companyName");


--
-- Name: company company_companyName_key567; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key567" UNIQUE ("companyName");


--
-- Name: company company_companyName_key568; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key568" UNIQUE ("companyName");


--
-- Name: company company_companyName_key569; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key569" UNIQUE ("companyName");


--
-- Name: company company_companyName_key57; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key57" UNIQUE ("companyName");


--
-- Name: company company_companyName_key570; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key570" UNIQUE ("companyName");


--
-- Name: company company_companyName_key571; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key571" UNIQUE ("companyName");


--
-- Name: company company_companyName_key572; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key572" UNIQUE ("companyName");


--
-- Name: company company_companyName_key573; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key573" UNIQUE ("companyName");


--
-- Name: company company_companyName_key574; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key574" UNIQUE ("companyName");


--
-- Name: company company_companyName_key575; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key575" UNIQUE ("companyName");


--
-- Name: company company_companyName_key576; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key576" UNIQUE ("companyName");


--
-- Name: company company_companyName_key577; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key577" UNIQUE ("companyName");


--
-- Name: company company_companyName_key578; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key578" UNIQUE ("companyName");


--
-- Name: company company_companyName_key579; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key579" UNIQUE ("companyName");


--
-- Name: company company_companyName_key58; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key58" UNIQUE ("companyName");


--
-- Name: company company_companyName_key580; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key580" UNIQUE ("companyName");


--
-- Name: company company_companyName_key581; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key581" UNIQUE ("companyName");


--
-- Name: company company_companyName_key582; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key582" UNIQUE ("companyName");


--
-- Name: company company_companyName_key583; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key583" UNIQUE ("companyName");


--
-- Name: company company_companyName_key584; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key584" UNIQUE ("companyName");


--
-- Name: company company_companyName_key585; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key585" UNIQUE ("companyName");


--
-- Name: company company_companyName_key586; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key586" UNIQUE ("companyName");


--
-- Name: company company_companyName_key587; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key587" UNIQUE ("companyName");


--
-- Name: company company_companyName_key588; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key588" UNIQUE ("companyName");


--
-- Name: company company_companyName_key589; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key589" UNIQUE ("companyName");


--
-- Name: company company_companyName_key59; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key59" UNIQUE ("companyName");


--
-- Name: company company_companyName_key590; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key590" UNIQUE ("companyName");


--
-- Name: company company_companyName_key591; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key591" UNIQUE ("companyName");


--
-- Name: company company_companyName_key592; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key592" UNIQUE ("companyName");


--
-- Name: company company_companyName_key593; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key593" UNIQUE ("companyName");


--
-- Name: company company_companyName_key594; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key594" UNIQUE ("companyName");


--
-- Name: company company_companyName_key595; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key595" UNIQUE ("companyName");


--
-- Name: company company_companyName_key596; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key596" UNIQUE ("companyName");


--
-- Name: company company_companyName_key597; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key597" UNIQUE ("companyName");


--
-- Name: company company_companyName_key598; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key598" UNIQUE ("companyName");


--
-- Name: company company_companyName_key599; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key599" UNIQUE ("companyName");


--
-- Name: company company_companyName_key6; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key6" UNIQUE ("companyName");


--
-- Name: company company_companyName_key60; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key60" UNIQUE ("companyName");


--
-- Name: company company_companyName_key600; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key600" UNIQUE ("companyName");


--
-- Name: company company_companyName_key601; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key601" UNIQUE ("companyName");


--
-- Name: company company_companyName_key602; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key602" UNIQUE ("companyName");


--
-- Name: company company_companyName_key603; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key603" UNIQUE ("companyName");


--
-- Name: company company_companyName_key604; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key604" UNIQUE ("companyName");


--
-- Name: company company_companyName_key605; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key605" UNIQUE ("companyName");


--
-- Name: company company_companyName_key606; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key606" UNIQUE ("companyName");


--
-- Name: company company_companyName_key607; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key607" UNIQUE ("companyName");


--
-- Name: company company_companyName_key608; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key608" UNIQUE ("companyName");


--
-- Name: company company_companyName_key609; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key609" UNIQUE ("companyName");


--
-- Name: company company_companyName_key61; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key61" UNIQUE ("companyName");


--
-- Name: company company_companyName_key610; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key610" UNIQUE ("companyName");


--
-- Name: company company_companyName_key611; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key611" UNIQUE ("companyName");


--
-- Name: company company_companyName_key612; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key612" UNIQUE ("companyName");


--
-- Name: company company_companyName_key613; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key613" UNIQUE ("companyName");


--
-- Name: company company_companyName_key614; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key614" UNIQUE ("companyName");


--
-- Name: company company_companyName_key615; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key615" UNIQUE ("companyName");


--
-- Name: company company_companyName_key616; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key616" UNIQUE ("companyName");


--
-- Name: company company_companyName_key617; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key617" UNIQUE ("companyName");


--
-- Name: company company_companyName_key618; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key618" UNIQUE ("companyName");


--
-- Name: company company_companyName_key619; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key619" UNIQUE ("companyName");


--
-- Name: company company_companyName_key62; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key62" UNIQUE ("companyName");


--
-- Name: company company_companyName_key620; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key620" UNIQUE ("companyName");


--
-- Name: company company_companyName_key621; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key621" UNIQUE ("companyName");


--
-- Name: company company_companyName_key622; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key622" UNIQUE ("companyName");


--
-- Name: company company_companyName_key623; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key623" UNIQUE ("companyName");


--
-- Name: company company_companyName_key624; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key624" UNIQUE ("companyName");


--
-- Name: company company_companyName_key625; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key625" UNIQUE ("companyName");


--
-- Name: company company_companyName_key626; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key626" UNIQUE ("companyName");


--
-- Name: company company_companyName_key627; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key627" UNIQUE ("companyName");


--
-- Name: company company_companyName_key628; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key628" UNIQUE ("companyName");


--
-- Name: company company_companyName_key629; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key629" UNIQUE ("companyName");


--
-- Name: company company_companyName_key63; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key63" UNIQUE ("companyName");


--
-- Name: company company_companyName_key630; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key630" UNIQUE ("companyName");


--
-- Name: company company_companyName_key631; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key631" UNIQUE ("companyName");


--
-- Name: company company_companyName_key632; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key632" UNIQUE ("companyName");


--
-- Name: company company_companyName_key633; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key633" UNIQUE ("companyName");


--
-- Name: company company_companyName_key634; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key634" UNIQUE ("companyName");


--
-- Name: company company_companyName_key635; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key635" UNIQUE ("companyName");


--
-- Name: company company_companyName_key636; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key636" UNIQUE ("companyName");


--
-- Name: company company_companyName_key637; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key637" UNIQUE ("companyName");


--
-- Name: company company_companyName_key638; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key638" UNIQUE ("companyName");


--
-- Name: company company_companyName_key639; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key639" UNIQUE ("companyName");


--
-- Name: company company_companyName_key64; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key64" UNIQUE ("companyName");


--
-- Name: company company_companyName_key640; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key640" UNIQUE ("companyName");


--
-- Name: company company_companyName_key641; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key641" UNIQUE ("companyName");


--
-- Name: company company_companyName_key642; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key642" UNIQUE ("companyName");


--
-- Name: company company_companyName_key643; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key643" UNIQUE ("companyName");


--
-- Name: company company_companyName_key644; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key644" UNIQUE ("companyName");


--
-- Name: company company_companyName_key645; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key645" UNIQUE ("companyName");


--
-- Name: company company_companyName_key646; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key646" UNIQUE ("companyName");


--
-- Name: company company_companyName_key647; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key647" UNIQUE ("companyName");


--
-- Name: company company_companyName_key648; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key648" UNIQUE ("companyName");


--
-- Name: company company_companyName_key649; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key649" UNIQUE ("companyName");


--
-- Name: company company_companyName_key65; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key65" UNIQUE ("companyName");


--
-- Name: company company_companyName_key650; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key650" UNIQUE ("companyName");


--
-- Name: company company_companyName_key651; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key651" UNIQUE ("companyName");


--
-- Name: company company_companyName_key652; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key652" UNIQUE ("companyName");


--
-- Name: company company_companyName_key653; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key653" UNIQUE ("companyName");


--
-- Name: company company_companyName_key654; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key654" UNIQUE ("companyName");


--
-- Name: company company_companyName_key655; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key655" UNIQUE ("companyName");


--
-- Name: company company_companyName_key656; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key656" UNIQUE ("companyName");


--
-- Name: company company_companyName_key657; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key657" UNIQUE ("companyName");


--
-- Name: company company_companyName_key658; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key658" UNIQUE ("companyName");


--
-- Name: company company_companyName_key659; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key659" UNIQUE ("companyName");


--
-- Name: company company_companyName_key66; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key66" UNIQUE ("companyName");


--
-- Name: company company_companyName_key660; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key660" UNIQUE ("companyName");


--
-- Name: company company_companyName_key661; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key661" UNIQUE ("companyName");


--
-- Name: company company_companyName_key662; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key662" UNIQUE ("companyName");


--
-- Name: company company_companyName_key663; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key663" UNIQUE ("companyName");


--
-- Name: company company_companyName_key664; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key664" UNIQUE ("companyName");


--
-- Name: company company_companyName_key665; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key665" UNIQUE ("companyName");


--
-- Name: company company_companyName_key666; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key666" UNIQUE ("companyName");


--
-- Name: company company_companyName_key667; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key667" UNIQUE ("companyName");


--
-- Name: company company_companyName_key668; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key668" UNIQUE ("companyName");


--
-- Name: company company_companyName_key669; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key669" UNIQUE ("companyName");


--
-- Name: company company_companyName_key67; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key67" UNIQUE ("companyName");


--
-- Name: company company_companyName_key670; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key670" UNIQUE ("companyName");


--
-- Name: company company_companyName_key671; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key671" UNIQUE ("companyName");


--
-- Name: company company_companyName_key672; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key672" UNIQUE ("companyName");


--
-- Name: company company_companyName_key673; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key673" UNIQUE ("companyName");


--
-- Name: company company_companyName_key674; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key674" UNIQUE ("companyName");


--
-- Name: company company_companyName_key675; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key675" UNIQUE ("companyName");


--
-- Name: company company_companyName_key676; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key676" UNIQUE ("companyName");


--
-- Name: company company_companyName_key677; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key677" UNIQUE ("companyName");


--
-- Name: company company_companyName_key678; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key678" UNIQUE ("companyName");


--
-- Name: company company_companyName_key679; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key679" UNIQUE ("companyName");


--
-- Name: company company_companyName_key68; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key68" UNIQUE ("companyName");


--
-- Name: company company_companyName_key680; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key680" UNIQUE ("companyName");


--
-- Name: company company_companyName_key681; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key681" UNIQUE ("companyName");


--
-- Name: company company_companyName_key682; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key682" UNIQUE ("companyName");


--
-- Name: company company_companyName_key683; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key683" UNIQUE ("companyName");


--
-- Name: company company_companyName_key684; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key684" UNIQUE ("companyName");


--
-- Name: company company_companyName_key685; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key685" UNIQUE ("companyName");


--
-- Name: company company_companyName_key686; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key686" UNIQUE ("companyName");


--
-- Name: company company_companyName_key687; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key687" UNIQUE ("companyName");


--
-- Name: company company_companyName_key688; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key688" UNIQUE ("companyName");


--
-- Name: company company_companyName_key689; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key689" UNIQUE ("companyName");


--
-- Name: company company_companyName_key69; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key69" UNIQUE ("companyName");


--
-- Name: company company_companyName_key690; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key690" UNIQUE ("companyName");


--
-- Name: company company_companyName_key691; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key691" UNIQUE ("companyName");


--
-- Name: company company_companyName_key692; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key692" UNIQUE ("companyName");


--
-- Name: company company_companyName_key693; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key693" UNIQUE ("companyName");


--
-- Name: company company_companyName_key694; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key694" UNIQUE ("companyName");


--
-- Name: company company_companyName_key695; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key695" UNIQUE ("companyName");


--
-- Name: company company_companyName_key696; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key696" UNIQUE ("companyName");


--
-- Name: company company_companyName_key697; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key697" UNIQUE ("companyName");


--
-- Name: company company_companyName_key698; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key698" UNIQUE ("companyName");


--
-- Name: company company_companyName_key699; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key699" UNIQUE ("companyName");


--
-- Name: company company_companyName_key7; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key7" UNIQUE ("companyName");


--
-- Name: company company_companyName_key70; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key70" UNIQUE ("companyName");


--
-- Name: company company_companyName_key700; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key700" UNIQUE ("companyName");


--
-- Name: company company_companyName_key701; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key701" UNIQUE ("companyName");


--
-- Name: company company_companyName_key702; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key702" UNIQUE ("companyName");


--
-- Name: company company_companyName_key703; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key703" UNIQUE ("companyName");


--
-- Name: company company_companyName_key704; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key704" UNIQUE ("companyName");


--
-- Name: company company_companyName_key705; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key705" UNIQUE ("companyName");


--
-- Name: company company_companyName_key706; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key706" UNIQUE ("companyName");


--
-- Name: company company_companyName_key707; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key707" UNIQUE ("companyName");


--
-- Name: company company_companyName_key708; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key708" UNIQUE ("companyName");


--
-- Name: company company_companyName_key709; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key709" UNIQUE ("companyName");


--
-- Name: company company_companyName_key71; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key71" UNIQUE ("companyName");


--
-- Name: company company_companyName_key710; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key710" UNIQUE ("companyName");


--
-- Name: company company_companyName_key711; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key711" UNIQUE ("companyName");


--
-- Name: company company_companyName_key712; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key712" UNIQUE ("companyName");


--
-- Name: company company_companyName_key713; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key713" UNIQUE ("companyName");


--
-- Name: company company_companyName_key714; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key714" UNIQUE ("companyName");


--
-- Name: company company_companyName_key715; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key715" UNIQUE ("companyName");


--
-- Name: company company_companyName_key716; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key716" UNIQUE ("companyName");


--
-- Name: company company_companyName_key717; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key717" UNIQUE ("companyName");


--
-- Name: company company_companyName_key718; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key718" UNIQUE ("companyName");


--
-- Name: company company_companyName_key719; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key719" UNIQUE ("companyName");


--
-- Name: company company_companyName_key72; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key72" UNIQUE ("companyName");


--
-- Name: company company_companyName_key720; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key720" UNIQUE ("companyName");


--
-- Name: company company_companyName_key721; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key721" UNIQUE ("companyName");


--
-- Name: company company_companyName_key722; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key722" UNIQUE ("companyName");


--
-- Name: company company_companyName_key723; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key723" UNIQUE ("companyName");


--
-- Name: company company_companyName_key724; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key724" UNIQUE ("companyName");


--
-- Name: company company_companyName_key725; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key725" UNIQUE ("companyName");


--
-- Name: company company_companyName_key726; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key726" UNIQUE ("companyName");


--
-- Name: company company_companyName_key727; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key727" UNIQUE ("companyName");


--
-- Name: company company_companyName_key728; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key728" UNIQUE ("companyName");


--
-- Name: company company_companyName_key729; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key729" UNIQUE ("companyName");


--
-- Name: company company_companyName_key73; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key73" UNIQUE ("companyName");


--
-- Name: company company_companyName_key730; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key730" UNIQUE ("companyName");


--
-- Name: company company_companyName_key731; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key731" UNIQUE ("companyName");


--
-- Name: company company_companyName_key732; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key732" UNIQUE ("companyName");


--
-- Name: company company_companyName_key733; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key733" UNIQUE ("companyName");


--
-- Name: company company_companyName_key734; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key734" UNIQUE ("companyName");


--
-- Name: company company_companyName_key735; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key735" UNIQUE ("companyName");


--
-- Name: company company_companyName_key736; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key736" UNIQUE ("companyName");


--
-- Name: company company_companyName_key737; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key737" UNIQUE ("companyName");


--
-- Name: company company_companyName_key738; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key738" UNIQUE ("companyName");


--
-- Name: company company_companyName_key739; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key739" UNIQUE ("companyName");


--
-- Name: company company_companyName_key74; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key74" UNIQUE ("companyName");


--
-- Name: company company_companyName_key740; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key740" UNIQUE ("companyName");


--
-- Name: company company_companyName_key741; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key741" UNIQUE ("companyName");


--
-- Name: company company_companyName_key742; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key742" UNIQUE ("companyName");


--
-- Name: company company_companyName_key743; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key743" UNIQUE ("companyName");


--
-- Name: company company_companyName_key744; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key744" UNIQUE ("companyName");


--
-- Name: company company_companyName_key745; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key745" UNIQUE ("companyName");


--
-- Name: company company_companyName_key746; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key746" UNIQUE ("companyName");


--
-- Name: company company_companyName_key747; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key747" UNIQUE ("companyName");


--
-- Name: company company_companyName_key748; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key748" UNIQUE ("companyName");


--
-- Name: company company_companyName_key749; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key749" UNIQUE ("companyName");


--
-- Name: company company_companyName_key75; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key75" UNIQUE ("companyName");


--
-- Name: company company_companyName_key750; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key750" UNIQUE ("companyName");


--
-- Name: company company_companyName_key751; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key751" UNIQUE ("companyName");


--
-- Name: company company_companyName_key752; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key752" UNIQUE ("companyName");


--
-- Name: company company_companyName_key753; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key753" UNIQUE ("companyName");


--
-- Name: company company_companyName_key754; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key754" UNIQUE ("companyName");


--
-- Name: company company_companyName_key755; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key755" UNIQUE ("companyName");


--
-- Name: company company_companyName_key756; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key756" UNIQUE ("companyName");


--
-- Name: company company_companyName_key757; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key757" UNIQUE ("companyName");


--
-- Name: company company_companyName_key758; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key758" UNIQUE ("companyName");


--
-- Name: company company_companyName_key759; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key759" UNIQUE ("companyName");


--
-- Name: company company_companyName_key76; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key76" UNIQUE ("companyName");


--
-- Name: company company_companyName_key760; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key760" UNIQUE ("companyName");


--
-- Name: company company_companyName_key761; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key761" UNIQUE ("companyName");


--
-- Name: company company_companyName_key762; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key762" UNIQUE ("companyName");


--
-- Name: company company_companyName_key763; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key763" UNIQUE ("companyName");


--
-- Name: company company_companyName_key764; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key764" UNIQUE ("companyName");


--
-- Name: company company_companyName_key765; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key765" UNIQUE ("companyName");


--
-- Name: company company_companyName_key766; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key766" UNIQUE ("companyName");


--
-- Name: company company_companyName_key767; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key767" UNIQUE ("companyName");


--
-- Name: company company_companyName_key768; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key768" UNIQUE ("companyName");


--
-- Name: company company_companyName_key769; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key769" UNIQUE ("companyName");


--
-- Name: company company_companyName_key77; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key77" UNIQUE ("companyName");


--
-- Name: company company_companyName_key770; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key770" UNIQUE ("companyName");


--
-- Name: company company_companyName_key771; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key771" UNIQUE ("companyName");


--
-- Name: company company_companyName_key772; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key772" UNIQUE ("companyName");


--
-- Name: company company_companyName_key773; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key773" UNIQUE ("companyName");


--
-- Name: company company_companyName_key774; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key774" UNIQUE ("companyName");


--
-- Name: company company_companyName_key775; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key775" UNIQUE ("companyName");


--
-- Name: company company_companyName_key776; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key776" UNIQUE ("companyName");


--
-- Name: company company_companyName_key777; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key777" UNIQUE ("companyName");


--
-- Name: company company_companyName_key778; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key778" UNIQUE ("companyName");


--
-- Name: company company_companyName_key779; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key779" UNIQUE ("companyName");


--
-- Name: company company_companyName_key78; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key78" UNIQUE ("companyName");


--
-- Name: company company_companyName_key780; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key780" UNIQUE ("companyName");


--
-- Name: company company_companyName_key781; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key781" UNIQUE ("companyName");


--
-- Name: company company_companyName_key782; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key782" UNIQUE ("companyName");


--
-- Name: company company_companyName_key783; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key783" UNIQUE ("companyName");


--
-- Name: company company_companyName_key784; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key784" UNIQUE ("companyName");


--
-- Name: company company_companyName_key785; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key785" UNIQUE ("companyName");


--
-- Name: company company_companyName_key786; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key786" UNIQUE ("companyName");


--
-- Name: company company_companyName_key787; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key787" UNIQUE ("companyName");


--
-- Name: company company_companyName_key788; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key788" UNIQUE ("companyName");


--
-- Name: company company_companyName_key789; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key789" UNIQUE ("companyName");


--
-- Name: company company_companyName_key79; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key79" UNIQUE ("companyName");


--
-- Name: company company_companyName_key790; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key790" UNIQUE ("companyName");


--
-- Name: company company_companyName_key791; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key791" UNIQUE ("companyName");


--
-- Name: company company_companyName_key792; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key792" UNIQUE ("companyName");


--
-- Name: company company_companyName_key793; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key793" UNIQUE ("companyName");


--
-- Name: company company_companyName_key794; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key794" UNIQUE ("companyName");


--
-- Name: company company_companyName_key795; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key795" UNIQUE ("companyName");


--
-- Name: company company_companyName_key796; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key796" UNIQUE ("companyName");


--
-- Name: company company_companyName_key797; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key797" UNIQUE ("companyName");


--
-- Name: company company_companyName_key798; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key798" UNIQUE ("companyName");


--
-- Name: company company_companyName_key799; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key799" UNIQUE ("companyName");


--
-- Name: company company_companyName_key8; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key8" UNIQUE ("companyName");


--
-- Name: company company_companyName_key80; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key80" UNIQUE ("companyName");


--
-- Name: company company_companyName_key800; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key800" UNIQUE ("companyName");


--
-- Name: company company_companyName_key801; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key801" UNIQUE ("companyName");


--
-- Name: company company_companyName_key802; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key802" UNIQUE ("companyName");


--
-- Name: company company_companyName_key803; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key803" UNIQUE ("companyName");


--
-- Name: company company_companyName_key804; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key804" UNIQUE ("companyName");


--
-- Name: company company_companyName_key805; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key805" UNIQUE ("companyName");


--
-- Name: company company_companyName_key806; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key806" UNIQUE ("companyName");


--
-- Name: company company_companyName_key807; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key807" UNIQUE ("companyName");


--
-- Name: company company_companyName_key808; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key808" UNIQUE ("companyName");


--
-- Name: company company_companyName_key809; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key809" UNIQUE ("companyName");


--
-- Name: company company_companyName_key81; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key81" UNIQUE ("companyName");


--
-- Name: company company_companyName_key810; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key810" UNIQUE ("companyName");


--
-- Name: company company_companyName_key811; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key811" UNIQUE ("companyName");


--
-- Name: company company_companyName_key812; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key812" UNIQUE ("companyName");


--
-- Name: company company_companyName_key813; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key813" UNIQUE ("companyName");


--
-- Name: company company_companyName_key814; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key814" UNIQUE ("companyName");


--
-- Name: company company_companyName_key815; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key815" UNIQUE ("companyName");


--
-- Name: company company_companyName_key816; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key816" UNIQUE ("companyName");


--
-- Name: company company_companyName_key817; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key817" UNIQUE ("companyName");


--
-- Name: company company_companyName_key818; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key818" UNIQUE ("companyName");


--
-- Name: company company_companyName_key819; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key819" UNIQUE ("companyName");


--
-- Name: company company_companyName_key82; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key82" UNIQUE ("companyName");


--
-- Name: company company_companyName_key820; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key820" UNIQUE ("companyName");


--
-- Name: company company_companyName_key821; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key821" UNIQUE ("companyName");


--
-- Name: company company_companyName_key822; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key822" UNIQUE ("companyName");


--
-- Name: company company_companyName_key823; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key823" UNIQUE ("companyName");


--
-- Name: company company_companyName_key824; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key824" UNIQUE ("companyName");


--
-- Name: company company_companyName_key825; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key825" UNIQUE ("companyName");


--
-- Name: company company_companyName_key826; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key826" UNIQUE ("companyName");


--
-- Name: company company_companyName_key827; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key827" UNIQUE ("companyName");


--
-- Name: company company_companyName_key828; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key828" UNIQUE ("companyName");


--
-- Name: company company_companyName_key829; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key829" UNIQUE ("companyName");


--
-- Name: company company_companyName_key83; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key83" UNIQUE ("companyName");


--
-- Name: company company_companyName_key830; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key830" UNIQUE ("companyName");


--
-- Name: company company_companyName_key831; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key831" UNIQUE ("companyName");


--
-- Name: company company_companyName_key832; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key832" UNIQUE ("companyName");


--
-- Name: company company_companyName_key833; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key833" UNIQUE ("companyName");


--
-- Name: company company_companyName_key834; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key834" UNIQUE ("companyName");


--
-- Name: company company_companyName_key835; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key835" UNIQUE ("companyName");


--
-- Name: company company_companyName_key836; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key836" UNIQUE ("companyName");


--
-- Name: company company_companyName_key837; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key837" UNIQUE ("companyName");


--
-- Name: company company_companyName_key838; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key838" UNIQUE ("companyName");


--
-- Name: company company_companyName_key839; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key839" UNIQUE ("companyName");


--
-- Name: company company_companyName_key84; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key84" UNIQUE ("companyName");


--
-- Name: company company_companyName_key840; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key840" UNIQUE ("companyName");


--
-- Name: company company_companyName_key841; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key841" UNIQUE ("companyName");


--
-- Name: company company_companyName_key842; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key842" UNIQUE ("companyName");


--
-- Name: company company_companyName_key843; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key843" UNIQUE ("companyName");


--
-- Name: company company_companyName_key844; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key844" UNIQUE ("companyName");


--
-- Name: company company_companyName_key845; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key845" UNIQUE ("companyName");


--
-- Name: company company_companyName_key846; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key846" UNIQUE ("companyName");


--
-- Name: company company_companyName_key847; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key847" UNIQUE ("companyName");


--
-- Name: company company_companyName_key848; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key848" UNIQUE ("companyName");


--
-- Name: company company_companyName_key849; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key849" UNIQUE ("companyName");


--
-- Name: company company_companyName_key85; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key85" UNIQUE ("companyName");


--
-- Name: company company_companyName_key850; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key850" UNIQUE ("companyName");


--
-- Name: company company_companyName_key851; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key851" UNIQUE ("companyName");


--
-- Name: company company_companyName_key852; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key852" UNIQUE ("companyName");


--
-- Name: company company_companyName_key853; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key853" UNIQUE ("companyName");


--
-- Name: company company_companyName_key854; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key854" UNIQUE ("companyName");


--
-- Name: company company_companyName_key855; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key855" UNIQUE ("companyName");


--
-- Name: company company_companyName_key856; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key856" UNIQUE ("companyName");


--
-- Name: company company_companyName_key857; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key857" UNIQUE ("companyName");


--
-- Name: company company_companyName_key858; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key858" UNIQUE ("companyName");


--
-- Name: company company_companyName_key859; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key859" UNIQUE ("companyName");


--
-- Name: company company_companyName_key86; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key86" UNIQUE ("companyName");


--
-- Name: company company_companyName_key860; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key860" UNIQUE ("companyName");


--
-- Name: company company_companyName_key861; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key861" UNIQUE ("companyName");


--
-- Name: company company_companyName_key862; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key862" UNIQUE ("companyName");


--
-- Name: company company_companyName_key863; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key863" UNIQUE ("companyName");


--
-- Name: company company_companyName_key864; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key864" UNIQUE ("companyName");


--
-- Name: company company_companyName_key865; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key865" UNIQUE ("companyName");


--
-- Name: company company_companyName_key866; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key866" UNIQUE ("companyName");


--
-- Name: company company_companyName_key867; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key867" UNIQUE ("companyName");


--
-- Name: company company_companyName_key868; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key868" UNIQUE ("companyName");


--
-- Name: company company_companyName_key869; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key869" UNIQUE ("companyName");


--
-- Name: company company_companyName_key87; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key87" UNIQUE ("companyName");


--
-- Name: company company_companyName_key870; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key870" UNIQUE ("companyName");


--
-- Name: company company_companyName_key871; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key871" UNIQUE ("companyName");


--
-- Name: company company_companyName_key872; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key872" UNIQUE ("companyName");


--
-- Name: company company_companyName_key873; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key873" UNIQUE ("companyName");


--
-- Name: company company_companyName_key874; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key874" UNIQUE ("companyName");


--
-- Name: company company_companyName_key875; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key875" UNIQUE ("companyName");


--
-- Name: company company_companyName_key876; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key876" UNIQUE ("companyName");


--
-- Name: company company_companyName_key877; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key877" UNIQUE ("companyName");


--
-- Name: company company_companyName_key878; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key878" UNIQUE ("companyName");


--
-- Name: company company_companyName_key879; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key879" UNIQUE ("companyName");


--
-- Name: company company_companyName_key88; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key88" UNIQUE ("companyName");


--
-- Name: company company_companyName_key880; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key880" UNIQUE ("companyName");


--
-- Name: company company_companyName_key881; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key881" UNIQUE ("companyName");


--
-- Name: company company_companyName_key882; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key882" UNIQUE ("companyName");


--
-- Name: company company_companyName_key883; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key883" UNIQUE ("companyName");


--
-- Name: company company_companyName_key884; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key884" UNIQUE ("companyName");


--
-- Name: company company_companyName_key885; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key885" UNIQUE ("companyName");


--
-- Name: company company_companyName_key886; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key886" UNIQUE ("companyName");


--
-- Name: company company_companyName_key887; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key887" UNIQUE ("companyName");


--
-- Name: company company_companyName_key888; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key888" UNIQUE ("companyName");


--
-- Name: company company_companyName_key889; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key889" UNIQUE ("companyName");


--
-- Name: company company_companyName_key89; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key89" UNIQUE ("companyName");


--
-- Name: company company_companyName_key890; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key890" UNIQUE ("companyName");


--
-- Name: company company_companyName_key891; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key891" UNIQUE ("companyName");


--
-- Name: company company_companyName_key892; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key892" UNIQUE ("companyName");


--
-- Name: company company_companyName_key893; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key893" UNIQUE ("companyName");


--
-- Name: company company_companyName_key894; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key894" UNIQUE ("companyName");


--
-- Name: company company_companyName_key895; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key895" UNIQUE ("companyName");


--
-- Name: company company_companyName_key896; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key896" UNIQUE ("companyName");


--
-- Name: company company_companyName_key897; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key897" UNIQUE ("companyName");


--
-- Name: company company_companyName_key898; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key898" UNIQUE ("companyName");


--
-- Name: company company_companyName_key899; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key899" UNIQUE ("companyName");


--
-- Name: company company_companyName_key9; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key9" UNIQUE ("companyName");


--
-- Name: company company_companyName_key90; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key90" UNIQUE ("companyName");


--
-- Name: company company_companyName_key900; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key900" UNIQUE ("companyName");


--
-- Name: company company_companyName_key901; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key901" UNIQUE ("companyName");


--
-- Name: company company_companyName_key902; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key902" UNIQUE ("companyName");


--
-- Name: company company_companyName_key903; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key903" UNIQUE ("companyName");


--
-- Name: company company_companyName_key904; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key904" UNIQUE ("companyName");


--
-- Name: company company_companyName_key905; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key905" UNIQUE ("companyName");


--
-- Name: company company_companyName_key906; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key906" UNIQUE ("companyName");


--
-- Name: company company_companyName_key907; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key907" UNIQUE ("companyName");


--
-- Name: company company_companyName_key908; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key908" UNIQUE ("companyName");


--
-- Name: company company_companyName_key909; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key909" UNIQUE ("companyName");


--
-- Name: company company_companyName_key91; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key91" UNIQUE ("companyName");


--
-- Name: company company_companyName_key910; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key910" UNIQUE ("companyName");


--
-- Name: company company_companyName_key911; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key911" UNIQUE ("companyName");


--
-- Name: company company_companyName_key912; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key912" UNIQUE ("companyName");


--
-- Name: company company_companyName_key913; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key913" UNIQUE ("companyName");


--
-- Name: company company_companyName_key914; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key914" UNIQUE ("companyName");


--
-- Name: company company_companyName_key915; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key915" UNIQUE ("companyName");


--
-- Name: company company_companyName_key916; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key916" UNIQUE ("companyName");


--
-- Name: company company_companyName_key917; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key917" UNIQUE ("companyName");


--
-- Name: company company_companyName_key918; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key918" UNIQUE ("companyName");


--
-- Name: company company_companyName_key919; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key919" UNIQUE ("companyName");


--
-- Name: company company_companyName_key92; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key92" UNIQUE ("companyName");


--
-- Name: company company_companyName_key920; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key920" UNIQUE ("companyName");


--
-- Name: company company_companyName_key921; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key921" UNIQUE ("companyName");


--
-- Name: company company_companyName_key922; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key922" UNIQUE ("companyName");


--
-- Name: company company_companyName_key923; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key923" UNIQUE ("companyName");


--
-- Name: company company_companyName_key924; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key924" UNIQUE ("companyName");


--
-- Name: company company_companyName_key925; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key925" UNIQUE ("companyName");


--
-- Name: company company_companyName_key926; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key926" UNIQUE ("companyName");


--
-- Name: company company_companyName_key927; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key927" UNIQUE ("companyName");


--
-- Name: company company_companyName_key928; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key928" UNIQUE ("companyName");


--
-- Name: company company_companyName_key929; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key929" UNIQUE ("companyName");


--
-- Name: company company_companyName_key93; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key93" UNIQUE ("companyName");


--
-- Name: company company_companyName_key930; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key930" UNIQUE ("companyName");


--
-- Name: company company_companyName_key931; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key931" UNIQUE ("companyName");


--
-- Name: company company_companyName_key932; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key932" UNIQUE ("companyName");


--
-- Name: company company_companyName_key933; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key933" UNIQUE ("companyName");


--
-- Name: company company_companyName_key934; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key934" UNIQUE ("companyName");


--
-- Name: company company_companyName_key935; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key935" UNIQUE ("companyName");


--
-- Name: company company_companyName_key936; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key936" UNIQUE ("companyName");


--
-- Name: company company_companyName_key937; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key937" UNIQUE ("companyName");


--
-- Name: company company_companyName_key938; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key938" UNIQUE ("companyName");


--
-- Name: company company_companyName_key939; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key939" UNIQUE ("companyName");


--
-- Name: company company_companyName_key94; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key94" UNIQUE ("companyName");


--
-- Name: company company_companyName_key940; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key940" UNIQUE ("companyName");


--
-- Name: company company_companyName_key941; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key941" UNIQUE ("companyName");


--
-- Name: company company_companyName_key942; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key942" UNIQUE ("companyName");


--
-- Name: company company_companyName_key943; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key943" UNIQUE ("companyName");


--
-- Name: company company_companyName_key944; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key944" UNIQUE ("companyName");


--
-- Name: company company_companyName_key945; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key945" UNIQUE ("companyName");


--
-- Name: company company_companyName_key946; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key946" UNIQUE ("companyName");


--
-- Name: company company_companyName_key947; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key947" UNIQUE ("companyName");


--
-- Name: company company_companyName_key948; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key948" UNIQUE ("companyName");


--
-- Name: company company_companyName_key949; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key949" UNIQUE ("companyName");


--
-- Name: company company_companyName_key95; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key95" UNIQUE ("companyName");


--
-- Name: company company_companyName_key950; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key950" UNIQUE ("companyName");


--
-- Name: company company_companyName_key951; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key951" UNIQUE ("companyName");


--
-- Name: company company_companyName_key952; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key952" UNIQUE ("companyName");


--
-- Name: company company_companyName_key953; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key953" UNIQUE ("companyName");


--
-- Name: company company_companyName_key954; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key954" UNIQUE ("companyName");


--
-- Name: company company_companyName_key955; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key955" UNIQUE ("companyName");


--
-- Name: company company_companyName_key956; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key956" UNIQUE ("companyName");


--
-- Name: company company_companyName_key957; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key957" UNIQUE ("companyName");


--
-- Name: company company_companyName_key958; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key958" UNIQUE ("companyName");


--
-- Name: company company_companyName_key959; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key959" UNIQUE ("companyName");


--
-- Name: company company_companyName_key96; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key96" UNIQUE ("companyName");


--
-- Name: company company_companyName_key960; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key960" UNIQUE ("companyName");


--
-- Name: company company_companyName_key961; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key961" UNIQUE ("companyName");


--
-- Name: company company_companyName_key962; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key962" UNIQUE ("companyName");


--
-- Name: company company_companyName_key963; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key963" UNIQUE ("companyName");


--
-- Name: company company_companyName_key964; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key964" UNIQUE ("companyName");


--
-- Name: company company_companyName_key965; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key965" UNIQUE ("companyName");


--
-- Name: company company_companyName_key966; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key966" UNIQUE ("companyName");


--
-- Name: company company_companyName_key967; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key967" UNIQUE ("companyName");


--
-- Name: company company_companyName_key968; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key968" UNIQUE ("companyName");


--
-- Name: company company_companyName_key969; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key969" UNIQUE ("companyName");


--
-- Name: company company_companyName_key97; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key97" UNIQUE ("companyName");


--
-- Name: company company_companyName_key970; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key970" UNIQUE ("companyName");


--
-- Name: company company_companyName_key971; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key971" UNIQUE ("companyName");


--
-- Name: company company_companyName_key972; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key972" UNIQUE ("companyName");


--
-- Name: company company_companyName_key973; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key973" UNIQUE ("companyName");


--
-- Name: company company_companyName_key974; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key974" UNIQUE ("companyName");


--
-- Name: company company_companyName_key975; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key975" UNIQUE ("companyName");


--
-- Name: company company_companyName_key976; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key976" UNIQUE ("companyName");


--
-- Name: company company_companyName_key977; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key977" UNIQUE ("companyName");


--
-- Name: company company_companyName_key978; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key978" UNIQUE ("companyName");


--
-- Name: company company_companyName_key979; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key979" UNIQUE ("companyName");


--
-- Name: company company_companyName_key98; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key98" UNIQUE ("companyName");


--
-- Name: company company_companyName_key980; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key980" UNIQUE ("companyName");


--
-- Name: company company_companyName_key981; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key981" UNIQUE ("companyName");


--
-- Name: company company_companyName_key982; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key982" UNIQUE ("companyName");


--
-- Name: company company_companyName_key983; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key983" UNIQUE ("companyName");


--
-- Name: company company_companyName_key984; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key984" UNIQUE ("companyName");


--
-- Name: company company_companyName_key985; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key985" UNIQUE ("companyName");


--
-- Name: company company_companyName_key986; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key986" UNIQUE ("companyName");


--
-- Name: company company_companyName_key987; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key987" UNIQUE ("companyName");


--
-- Name: company company_companyName_key988; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key988" UNIQUE ("companyName");


--
-- Name: company company_companyName_key989; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key989" UNIQUE ("companyName");


--
-- Name: company company_companyName_key99; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key99" UNIQUE ("companyName");


--
-- Name: company company_companyName_key990; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key990" UNIQUE ("companyName");


--
-- Name: company company_companyName_key991; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key991" UNIQUE ("companyName");


--
-- Name: company company_companyName_key992; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key992" UNIQUE ("companyName");


--
-- Name: company company_companyName_key993; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key993" UNIQUE ("companyName");


--
-- Name: company company_companyName_key994; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key994" UNIQUE ("companyName");


--
-- Name: company company_companyName_key995; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key995" UNIQUE ("companyName");


--
-- Name: company company_companyName_key996; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key996" UNIQUE ("companyName");


--
-- Name: company company_companyName_key997; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key997" UNIQUE ("companyName");


--
-- Name: company company_companyName_key998; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key998" UNIQUE ("companyName");


--
-- Name: company company_companyName_key999; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key999" UNIQUE ("companyName");


--
-- Name: company company_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (id);


--
-- Name: performaInvoices performaInvoices_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."performaInvoices"
    ADD CONSTRAINT "performaInvoices_pkey" PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- Name: users users_email_key10; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key10 UNIQUE (email);


--
-- Name: users users_email_key100; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key100 UNIQUE (email);


--
-- Name: users users_email_key101; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key101 UNIQUE (email);


--
-- Name: users users_email_key102; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key102 UNIQUE (email);


--
-- Name: users users_email_key103; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key103 UNIQUE (email);


--
-- Name: users users_email_key104; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key104 UNIQUE (email);


--
-- Name: users users_email_key105; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key105 UNIQUE (email);


--
-- Name: users users_email_key106; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key106 UNIQUE (email);


--
-- Name: users users_email_key107; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key107 UNIQUE (email);


--
-- Name: users users_email_key108; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key108 UNIQUE (email);


--
-- Name: users users_email_key109; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key109 UNIQUE (email);


--
-- Name: users users_email_key11; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key11 UNIQUE (email);


--
-- Name: users users_email_key110; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key110 UNIQUE (email);


--
-- Name: users users_email_key111; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key111 UNIQUE (email);


--
-- Name: users users_email_key112; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key112 UNIQUE (email);


--
-- Name: users users_email_key113; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key113 UNIQUE (email);


--
-- Name: users users_email_key114; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key114 UNIQUE (email);


--
-- Name: users users_email_key115; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key115 UNIQUE (email);


--
-- Name: users users_email_key116; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key116 UNIQUE (email);


--
-- Name: users users_email_key117; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key117 UNIQUE (email);


--
-- Name: users users_email_key118; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key118 UNIQUE (email);


--
-- Name: users users_email_key119; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key119 UNIQUE (email);


--
-- Name: users users_email_key12; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key12 UNIQUE (email);


--
-- Name: users users_email_key120; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key120 UNIQUE (email);


--
-- Name: users users_email_key121; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key121 UNIQUE (email);


--
-- Name: users users_email_key122; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key122 UNIQUE (email);


--
-- Name: users users_email_key123; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key123 UNIQUE (email);


--
-- Name: users users_email_key124; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key124 UNIQUE (email);


--
-- Name: users users_email_key125; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key125 UNIQUE (email);


--
-- Name: users users_email_key126; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key126 UNIQUE (email);


--
-- Name: users users_email_key127; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key127 UNIQUE (email);


--
-- Name: users users_email_key128; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key128 UNIQUE (email);


--
-- Name: users users_email_key129; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key129 UNIQUE (email);


--
-- Name: users users_email_key13; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key13 UNIQUE (email);


--
-- Name: users users_email_key130; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key130 UNIQUE (email);


--
-- Name: users users_email_key131; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key131 UNIQUE (email);


--
-- Name: users users_email_key132; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key132 UNIQUE (email);


--
-- Name: users users_email_key133; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key133 UNIQUE (email);


--
-- Name: users users_email_key134; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key134 UNIQUE (email);


--
-- Name: users users_email_key135; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key135 UNIQUE (email);


--
-- Name: users users_email_key136; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key136 UNIQUE (email);


--
-- Name: users users_email_key137; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key137 UNIQUE (email);


--
-- Name: users users_email_key138; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key138 UNIQUE (email);


--
-- Name: users users_email_key139; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key139 UNIQUE (email);


--
-- Name: users users_email_key14; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key14 UNIQUE (email);


--
-- Name: users users_email_key140; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key140 UNIQUE (email);


--
-- Name: users users_email_key141; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key141 UNIQUE (email);


--
-- Name: users users_email_key142; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key142 UNIQUE (email);


--
-- Name: users users_email_key143; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key143 UNIQUE (email);


--
-- Name: users users_email_key144; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key144 UNIQUE (email);


--
-- Name: users users_email_key145; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key145 UNIQUE (email);


--
-- Name: users users_email_key146; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key146 UNIQUE (email);


--
-- Name: users users_email_key147; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key147 UNIQUE (email);


--
-- Name: users users_email_key148; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key148 UNIQUE (email);


--
-- Name: users users_email_key149; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key149 UNIQUE (email);


--
-- Name: users users_email_key15; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key15 UNIQUE (email);


--
-- Name: users users_email_key150; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key150 UNIQUE (email);


--
-- Name: users users_email_key151; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key151 UNIQUE (email);


--
-- Name: users users_email_key152; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key152 UNIQUE (email);


--
-- Name: users users_email_key153; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key153 UNIQUE (email);


--
-- Name: users users_email_key154; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key154 UNIQUE (email);


--
-- Name: users users_email_key155; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key155 UNIQUE (email);


--
-- Name: users users_email_key156; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key156 UNIQUE (email);


--
-- Name: users users_email_key157; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key157 UNIQUE (email);


--
-- Name: users users_email_key158; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key158 UNIQUE (email);


--
-- Name: users users_email_key159; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key159 UNIQUE (email);


--
-- Name: users users_email_key16; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key16 UNIQUE (email);


--
-- Name: users users_email_key160; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key160 UNIQUE (email);


--
-- Name: users users_email_key161; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key161 UNIQUE (email);


--
-- Name: users users_email_key162; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key162 UNIQUE (email);


--
-- Name: users users_email_key163; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key163 UNIQUE (email);


--
-- Name: users users_email_key164; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key164 UNIQUE (email);


--
-- Name: users users_email_key165; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key165 UNIQUE (email);


--
-- Name: users users_email_key166; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key166 UNIQUE (email);


--
-- Name: users users_email_key167; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key167 UNIQUE (email);


--
-- Name: users users_email_key168; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key168 UNIQUE (email);


--
-- Name: users users_email_key169; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key169 UNIQUE (email);


--
-- Name: users users_email_key17; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key17 UNIQUE (email);


--
-- Name: users users_email_key170; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key170 UNIQUE (email);


--
-- Name: users users_email_key171; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key171 UNIQUE (email);


--
-- Name: users users_email_key172; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key172 UNIQUE (email);


--
-- Name: users users_email_key173; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key173 UNIQUE (email);


--
-- Name: users users_email_key174; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key174 UNIQUE (email);


--
-- Name: users users_email_key175; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key175 UNIQUE (email);


--
-- Name: users users_email_key176; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key176 UNIQUE (email);


--
-- Name: users users_email_key177; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key177 UNIQUE (email);


--
-- Name: users users_email_key178; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key178 UNIQUE (email);


--
-- Name: users users_email_key179; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key179 UNIQUE (email);


--
-- Name: users users_email_key18; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key18 UNIQUE (email);


--
-- Name: users users_email_key180; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key180 UNIQUE (email);


--
-- Name: users users_email_key181; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key181 UNIQUE (email);


--
-- Name: users users_email_key182; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key182 UNIQUE (email);


--
-- Name: users users_email_key183; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key183 UNIQUE (email);


--
-- Name: users users_email_key184; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key184 UNIQUE (email);


--
-- Name: users users_email_key185; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key185 UNIQUE (email);


--
-- Name: users users_email_key186; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key186 UNIQUE (email);


--
-- Name: users users_email_key187; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key187 UNIQUE (email);


--
-- Name: users users_email_key188; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key188 UNIQUE (email);


--
-- Name: users users_email_key189; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key189 UNIQUE (email);


--
-- Name: users users_email_key19; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key19 UNIQUE (email);


--
-- Name: users users_email_key190; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key190 UNIQUE (email);


--
-- Name: users users_email_key191; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key191 UNIQUE (email);


--
-- Name: users users_email_key192; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key192 UNIQUE (email);


--
-- Name: users users_email_key193; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key193 UNIQUE (email);


--
-- Name: users users_email_key194; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key194 UNIQUE (email);


--
-- Name: users users_email_key195; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key195 UNIQUE (email);


--
-- Name: users users_email_key196; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key196 UNIQUE (email);


--
-- Name: users users_email_key197; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key197 UNIQUE (email);


--
-- Name: users users_email_key198; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key198 UNIQUE (email);


--
-- Name: users users_email_key199; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key199 UNIQUE (email);


--
-- Name: users users_email_key2; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key2 UNIQUE (email);


--
-- Name: users users_email_key20; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key20 UNIQUE (email);


--
-- Name: users users_email_key200; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key200 UNIQUE (email);


--
-- Name: users users_email_key201; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key201 UNIQUE (email);


--
-- Name: users users_email_key202; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key202 UNIQUE (email);


--
-- Name: users users_email_key203; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key203 UNIQUE (email);


--
-- Name: users users_email_key204; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key204 UNIQUE (email);


--
-- Name: users users_email_key205; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key205 UNIQUE (email);


--
-- Name: users users_email_key206; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key206 UNIQUE (email);


--
-- Name: users users_email_key207; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key207 UNIQUE (email);


--
-- Name: users users_email_key208; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key208 UNIQUE (email);


--
-- Name: users users_email_key209; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key209 UNIQUE (email);


--
-- Name: users users_email_key21; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key21 UNIQUE (email);


--
-- Name: users users_email_key210; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key210 UNIQUE (email);


--
-- Name: users users_email_key211; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key211 UNIQUE (email);


--
-- Name: users users_email_key212; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key212 UNIQUE (email);


--
-- Name: users users_email_key213; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key213 UNIQUE (email);


--
-- Name: users users_email_key214; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key214 UNIQUE (email);


--
-- Name: users users_email_key215; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key215 UNIQUE (email);


--
-- Name: users users_email_key216; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key216 UNIQUE (email);


--
-- Name: users users_email_key217; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key217 UNIQUE (email);


--
-- Name: users users_email_key218; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key218 UNIQUE (email);


--
-- Name: users users_email_key219; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key219 UNIQUE (email);


--
-- Name: users users_email_key22; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key22 UNIQUE (email);


--
-- Name: users users_email_key220; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key220 UNIQUE (email);


--
-- Name: users users_email_key221; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key221 UNIQUE (email);


--
-- Name: users users_email_key222; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key222 UNIQUE (email);


--
-- Name: users users_email_key223; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key223 UNIQUE (email);


--
-- Name: users users_email_key224; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key224 UNIQUE (email);


--
-- Name: users users_email_key225; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key225 UNIQUE (email);


--
-- Name: users users_email_key226; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key226 UNIQUE (email);


--
-- Name: users users_email_key227; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key227 UNIQUE (email);


--
-- Name: users users_email_key228; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key228 UNIQUE (email);


--
-- Name: users users_email_key229; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key229 UNIQUE (email);


--
-- Name: users users_email_key23; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key23 UNIQUE (email);


--
-- Name: users users_email_key230; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key230 UNIQUE (email);


--
-- Name: users users_email_key231; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key231 UNIQUE (email);


--
-- Name: users users_email_key232; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key232 UNIQUE (email);


--
-- Name: users users_email_key233; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key233 UNIQUE (email);


--
-- Name: users users_email_key234; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key234 UNIQUE (email);


--
-- Name: users users_email_key235; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key235 UNIQUE (email);


--
-- Name: users users_email_key236; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key236 UNIQUE (email);


--
-- Name: users users_email_key237; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key237 UNIQUE (email);


--
-- Name: users users_email_key238; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key238 UNIQUE (email);


--
-- Name: users users_email_key239; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key239 UNIQUE (email);


--
-- Name: users users_email_key24; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key24 UNIQUE (email);


--
-- Name: users users_email_key240; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key240 UNIQUE (email);


--
-- Name: users users_email_key241; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key241 UNIQUE (email);


--
-- Name: users users_email_key242; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key242 UNIQUE (email);


--
-- Name: users users_email_key243; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key243 UNIQUE (email);


--
-- Name: users users_email_key244; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key244 UNIQUE (email);


--
-- Name: users users_email_key245; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key245 UNIQUE (email);


--
-- Name: users users_email_key246; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key246 UNIQUE (email);


--
-- Name: users users_email_key247; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key247 UNIQUE (email);


--
-- Name: users users_email_key248; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key248 UNIQUE (email);


--
-- Name: users users_email_key249; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key249 UNIQUE (email);


--
-- Name: users users_email_key25; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key25 UNIQUE (email);


--
-- Name: users users_email_key250; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key250 UNIQUE (email);


--
-- Name: users users_email_key251; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key251 UNIQUE (email);


--
-- Name: users users_email_key252; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key252 UNIQUE (email);


--
-- Name: users users_email_key253; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key253 UNIQUE (email);


--
-- Name: users users_email_key254; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key254 UNIQUE (email);


--
-- Name: users users_email_key255; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key255 UNIQUE (email);


--
-- Name: users users_email_key256; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key256 UNIQUE (email);


--
-- Name: users users_email_key257; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key257 UNIQUE (email);


--
-- Name: users users_email_key258; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key258 UNIQUE (email);


--
-- Name: users users_email_key259; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key259 UNIQUE (email);


--
-- Name: users users_email_key26; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key26 UNIQUE (email);


--
-- Name: users users_email_key260; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key260 UNIQUE (email);


--
-- Name: users users_email_key261; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key261 UNIQUE (email);


--
-- Name: users users_email_key262; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key262 UNIQUE (email);


--
-- Name: users users_email_key263; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key263 UNIQUE (email);


--
-- Name: users users_email_key264; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key264 UNIQUE (email);


--
-- Name: users users_email_key265; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key265 UNIQUE (email);


--
-- Name: users users_email_key266; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key266 UNIQUE (email);


--
-- Name: users users_email_key267; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key267 UNIQUE (email);


--
-- Name: users users_email_key268; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key268 UNIQUE (email);


--
-- Name: users users_email_key269; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key269 UNIQUE (email);


--
-- Name: users users_email_key27; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key27 UNIQUE (email);


--
-- Name: users users_email_key270; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key270 UNIQUE (email);


--
-- Name: users users_email_key271; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key271 UNIQUE (email);


--
-- Name: users users_email_key272; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key272 UNIQUE (email);


--
-- Name: users users_email_key273; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key273 UNIQUE (email);


--
-- Name: users users_email_key274; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key274 UNIQUE (email);


--
-- Name: users users_email_key275; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key275 UNIQUE (email);


--
-- Name: users users_email_key276; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key276 UNIQUE (email);


--
-- Name: users users_email_key277; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key277 UNIQUE (email);


--
-- Name: users users_email_key278; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key278 UNIQUE (email);


--
-- Name: users users_email_key279; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key279 UNIQUE (email);


--
-- Name: users users_email_key28; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key28 UNIQUE (email);


--
-- Name: users users_email_key280; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key280 UNIQUE (email);


--
-- Name: users users_email_key281; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key281 UNIQUE (email);


--
-- Name: users users_email_key282; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key282 UNIQUE (email);


--
-- Name: users users_email_key283; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key283 UNIQUE (email);


--
-- Name: users users_email_key284; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key284 UNIQUE (email);


--
-- Name: users users_email_key285; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key285 UNIQUE (email);


--
-- Name: users users_email_key286; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key286 UNIQUE (email);


--
-- Name: users users_email_key287; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key287 UNIQUE (email);


--
-- Name: users users_email_key288; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key288 UNIQUE (email);


--
-- Name: users users_email_key289; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key289 UNIQUE (email);


--
-- Name: users users_email_key29; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key29 UNIQUE (email);


--
-- Name: users users_email_key290; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key290 UNIQUE (email);


--
-- Name: users users_email_key291; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key291 UNIQUE (email);


--
-- Name: users users_email_key292; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key292 UNIQUE (email);


--
-- Name: users users_email_key293; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key293 UNIQUE (email);


--
-- Name: users users_email_key294; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key294 UNIQUE (email);


--
-- Name: users users_email_key295; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key295 UNIQUE (email);


--
-- Name: users users_email_key296; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key296 UNIQUE (email);


--
-- Name: users users_email_key297; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key297 UNIQUE (email);


--
-- Name: users users_email_key298; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key298 UNIQUE (email);


--
-- Name: users users_email_key299; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key299 UNIQUE (email);


--
-- Name: users users_email_key3; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key3 UNIQUE (email);


--
-- Name: users users_email_key30; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key30 UNIQUE (email);


--
-- Name: users users_email_key300; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key300 UNIQUE (email);


--
-- Name: users users_email_key301; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key301 UNIQUE (email);


--
-- Name: users users_email_key302; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key302 UNIQUE (email);


--
-- Name: users users_email_key303; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key303 UNIQUE (email);


--
-- Name: users users_email_key304; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key304 UNIQUE (email);


--
-- Name: users users_email_key305; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key305 UNIQUE (email);


--
-- Name: users users_email_key306; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key306 UNIQUE (email);


--
-- Name: users users_email_key307; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key307 UNIQUE (email);


--
-- Name: users users_email_key308; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key308 UNIQUE (email);


--
-- Name: users users_email_key309; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key309 UNIQUE (email);


--
-- Name: users users_email_key31; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key31 UNIQUE (email);


--
-- Name: users users_email_key310; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key310 UNIQUE (email);


--
-- Name: users users_email_key311; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key311 UNIQUE (email);


--
-- Name: users users_email_key312; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key312 UNIQUE (email);


--
-- Name: users users_email_key313; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key313 UNIQUE (email);


--
-- Name: users users_email_key314; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key314 UNIQUE (email);


--
-- Name: users users_email_key315; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key315 UNIQUE (email);


--
-- Name: users users_email_key316; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key316 UNIQUE (email);


--
-- Name: users users_email_key317; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key317 UNIQUE (email);


--
-- Name: users users_email_key318; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key318 UNIQUE (email);


--
-- Name: users users_email_key319; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key319 UNIQUE (email);


--
-- Name: users users_email_key32; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key32 UNIQUE (email);


--
-- Name: users users_email_key320; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key320 UNIQUE (email);


--
-- Name: users users_email_key321; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key321 UNIQUE (email);


--
-- Name: users users_email_key322; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key322 UNIQUE (email);


--
-- Name: users users_email_key323; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key323 UNIQUE (email);


--
-- Name: users users_email_key324; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key324 UNIQUE (email);


--
-- Name: users users_email_key325; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key325 UNIQUE (email);


--
-- Name: users users_email_key326; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key326 UNIQUE (email);


--
-- Name: users users_email_key327; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key327 UNIQUE (email);


--
-- Name: users users_email_key328; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key328 UNIQUE (email);


--
-- Name: users users_email_key329; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key329 UNIQUE (email);


--
-- Name: users users_email_key33; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key33 UNIQUE (email);


--
-- Name: users users_email_key330; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key330 UNIQUE (email);


--
-- Name: users users_email_key331; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key331 UNIQUE (email);


--
-- Name: users users_email_key332; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key332 UNIQUE (email);


--
-- Name: users users_email_key333; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key333 UNIQUE (email);


--
-- Name: users users_email_key334; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key334 UNIQUE (email);


--
-- Name: users users_email_key335; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key335 UNIQUE (email);


--
-- Name: users users_email_key336; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key336 UNIQUE (email);


--
-- Name: users users_email_key337; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key337 UNIQUE (email);


--
-- Name: users users_email_key338; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key338 UNIQUE (email);


--
-- Name: users users_email_key339; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key339 UNIQUE (email);


--
-- Name: users users_email_key34; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key34 UNIQUE (email);


--
-- Name: users users_email_key340; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key340 UNIQUE (email);


--
-- Name: users users_email_key341; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key341 UNIQUE (email);


--
-- Name: users users_email_key342; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key342 UNIQUE (email);


--
-- Name: users users_email_key343; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key343 UNIQUE (email);


--
-- Name: users users_email_key344; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key344 UNIQUE (email);


--
-- Name: users users_email_key345; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key345 UNIQUE (email);


--
-- Name: users users_email_key346; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key346 UNIQUE (email);


--
-- Name: users users_email_key347; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key347 UNIQUE (email);


--
-- Name: users users_email_key348; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key348 UNIQUE (email);


--
-- Name: users users_email_key349; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key349 UNIQUE (email);


--
-- Name: users users_email_key35; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key35 UNIQUE (email);


--
-- Name: users users_email_key350; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key350 UNIQUE (email);


--
-- Name: users users_email_key351; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key351 UNIQUE (email);


--
-- Name: users users_email_key352; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key352 UNIQUE (email);


--
-- Name: users users_email_key353; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key353 UNIQUE (email);


--
-- Name: users users_email_key354; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key354 UNIQUE (email);


--
-- Name: users users_email_key355; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key355 UNIQUE (email);


--
-- Name: users users_email_key356; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key356 UNIQUE (email);


--
-- Name: users users_email_key357; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key357 UNIQUE (email);


--
-- Name: users users_email_key358; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key358 UNIQUE (email);


--
-- Name: users users_email_key359; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key359 UNIQUE (email);


--
-- Name: users users_email_key36; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key36 UNIQUE (email);


--
-- Name: users users_email_key360; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key360 UNIQUE (email);


--
-- Name: users users_email_key361; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key361 UNIQUE (email);


--
-- Name: users users_email_key362; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key362 UNIQUE (email);


--
-- Name: users users_email_key363; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key363 UNIQUE (email);


--
-- Name: users users_email_key364; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key364 UNIQUE (email);


--
-- Name: users users_email_key365; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key365 UNIQUE (email);


--
-- Name: users users_email_key366; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key366 UNIQUE (email);


--
-- Name: users users_email_key367; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key367 UNIQUE (email);


--
-- Name: users users_email_key368; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key368 UNIQUE (email);


--
-- Name: users users_email_key369; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key369 UNIQUE (email);


--
-- Name: users users_email_key37; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key37 UNIQUE (email);


--
-- Name: users users_email_key370; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key370 UNIQUE (email);


--
-- Name: users users_email_key371; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key371 UNIQUE (email);


--
-- Name: users users_email_key372; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key372 UNIQUE (email);


--
-- Name: users users_email_key373; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key373 UNIQUE (email);


--
-- Name: users users_email_key374; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key374 UNIQUE (email);


--
-- Name: users users_email_key375; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key375 UNIQUE (email);


--
-- Name: users users_email_key376; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key376 UNIQUE (email);


--
-- Name: users users_email_key377; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key377 UNIQUE (email);


--
-- Name: users users_email_key378; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key378 UNIQUE (email);


--
-- Name: users users_email_key379; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key379 UNIQUE (email);


--
-- Name: users users_email_key38; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key38 UNIQUE (email);


--
-- Name: users users_email_key380; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key380 UNIQUE (email);


--
-- Name: users users_email_key381; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key381 UNIQUE (email);


--
-- Name: users users_email_key382; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key382 UNIQUE (email);


--
-- Name: users users_email_key383; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key383 UNIQUE (email);


--
-- Name: users users_email_key384; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key384 UNIQUE (email);


--
-- Name: users users_email_key385; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key385 UNIQUE (email);


--
-- Name: users users_email_key386; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key386 UNIQUE (email);


--
-- Name: users users_email_key387; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key387 UNIQUE (email);


--
-- Name: users users_email_key388; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key388 UNIQUE (email);


--
-- Name: users users_email_key389; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key389 UNIQUE (email);


--
-- Name: users users_email_key39; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key39 UNIQUE (email);


--
-- Name: users users_email_key390; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key390 UNIQUE (email);


--
-- Name: users users_email_key391; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key391 UNIQUE (email);


--
-- Name: users users_email_key392; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key392 UNIQUE (email);


--
-- Name: users users_email_key393; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key393 UNIQUE (email);


--
-- Name: users users_email_key394; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key394 UNIQUE (email);


--
-- Name: users users_email_key395; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key395 UNIQUE (email);


--
-- Name: users users_email_key396; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key396 UNIQUE (email);


--
-- Name: users users_email_key397; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key397 UNIQUE (email);


--
-- Name: users users_email_key398; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key398 UNIQUE (email);


--
-- Name: users users_email_key399; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key399 UNIQUE (email);


--
-- Name: users users_email_key4; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key4 UNIQUE (email);


--
-- Name: users users_email_key40; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key40 UNIQUE (email);


--
-- Name: users users_email_key400; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key400 UNIQUE (email);


--
-- Name: users users_email_key401; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key401 UNIQUE (email);


--
-- Name: users users_email_key402; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key402 UNIQUE (email);


--
-- Name: users users_email_key403; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key403 UNIQUE (email);


--
-- Name: users users_email_key404; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key404 UNIQUE (email);


--
-- Name: users users_email_key405; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key405 UNIQUE (email);


--
-- Name: users users_email_key406; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key406 UNIQUE (email);


--
-- Name: users users_email_key407; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key407 UNIQUE (email);


--
-- Name: users users_email_key408; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key408 UNIQUE (email);


--
-- Name: users users_email_key409; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key409 UNIQUE (email);


--
-- Name: users users_email_key41; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key41 UNIQUE (email);


--
-- Name: users users_email_key410; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key410 UNIQUE (email);


--
-- Name: users users_email_key411; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key411 UNIQUE (email);


--
-- Name: users users_email_key412; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key412 UNIQUE (email);


--
-- Name: users users_email_key413; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key413 UNIQUE (email);


--
-- Name: users users_email_key414; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key414 UNIQUE (email);


--
-- Name: users users_email_key415; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key415 UNIQUE (email);


--
-- Name: users users_email_key416; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key416 UNIQUE (email);


--
-- Name: users users_email_key417; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key417 UNIQUE (email);


--
-- Name: users users_email_key418; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key418 UNIQUE (email);


--
-- Name: users users_email_key419; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key419 UNIQUE (email);


--
-- Name: users users_email_key42; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key42 UNIQUE (email);


--
-- Name: users users_email_key420; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key420 UNIQUE (email);


--
-- Name: users users_email_key421; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key421 UNIQUE (email);


--
-- Name: users users_email_key422; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key422 UNIQUE (email);


--
-- Name: users users_email_key423; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key423 UNIQUE (email);


--
-- Name: users users_email_key424; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key424 UNIQUE (email);


--
-- Name: users users_email_key425; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key425 UNIQUE (email);


--
-- Name: users users_email_key426; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key426 UNIQUE (email);


--
-- Name: users users_email_key427; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key427 UNIQUE (email);


--
-- Name: users users_email_key428; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key428 UNIQUE (email);


--
-- Name: users users_email_key429; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key429 UNIQUE (email);


--
-- Name: users users_email_key43; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key43 UNIQUE (email);


--
-- Name: users users_email_key430; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key430 UNIQUE (email);


--
-- Name: users users_email_key431; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key431 UNIQUE (email);


--
-- Name: users users_email_key432; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key432 UNIQUE (email);


--
-- Name: users users_email_key433; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key433 UNIQUE (email);


--
-- Name: users users_email_key434; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key434 UNIQUE (email);


--
-- Name: users users_email_key435; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key435 UNIQUE (email);


--
-- Name: users users_email_key436; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key436 UNIQUE (email);


--
-- Name: users users_email_key437; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key437 UNIQUE (email);


--
-- Name: users users_email_key438; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key438 UNIQUE (email);


--
-- Name: users users_email_key439; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key439 UNIQUE (email);


--
-- Name: users users_email_key44; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key44 UNIQUE (email);


--
-- Name: users users_email_key440; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key440 UNIQUE (email);


--
-- Name: users users_email_key441; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key441 UNIQUE (email);


--
-- Name: users users_email_key442; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key442 UNIQUE (email);


--
-- Name: users users_email_key443; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key443 UNIQUE (email);


--
-- Name: users users_email_key444; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key444 UNIQUE (email);


--
-- Name: users users_email_key445; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key445 UNIQUE (email);


--
-- Name: users users_email_key446; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key446 UNIQUE (email);


--
-- Name: users users_email_key447; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key447 UNIQUE (email);


--
-- Name: users users_email_key448; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key448 UNIQUE (email);


--
-- Name: users users_email_key449; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key449 UNIQUE (email);


--
-- Name: users users_email_key45; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key45 UNIQUE (email);


--
-- Name: users users_email_key450; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key450 UNIQUE (email);


--
-- Name: users users_email_key451; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key451 UNIQUE (email);


--
-- Name: users users_email_key452; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key452 UNIQUE (email);


--
-- Name: users users_email_key453; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key453 UNIQUE (email);


--
-- Name: users users_email_key454; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key454 UNIQUE (email);


--
-- Name: users users_email_key455; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key455 UNIQUE (email);


--
-- Name: users users_email_key456; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key456 UNIQUE (email);


--
-- Name: users users_email_key457; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key457 UNIQUE (email);


--
-- Name: users users_email_key458; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key458 UNIQUE (email);


--
-- Name: users users_email_key459; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key459 UNIQUE (email);


--
-- Name: users users_email_key46; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key46 UNIQUE (email);


--
-- Name: users users_email_key460; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key460 UNIQUE (email);


--
-- Name: users users_email_key461; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key461 UNIQUE (email);


--
-- Name: users users_email_key462; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key462 UNIQUE (email);


--
-- Name: users users_email_key463; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key463 UNIQUE (email);


--
-- Name: users users_email_key464; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key464 UNIQUE (email);


--
-- Name: users users_email_key465; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key465 UNIQUE (email);


--
-- Name: users users_email_key466; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key466 UNIQUE (email);


--
-- Name: users users_email_key467; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key467 UNIQUE (email);


--
-- Name: users users_email_key468; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key468 UNIQUE (email);


--
-- Name: users users_email_key469; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key469 UNIQUE (email);


--
-- Name: users users_email_key47; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key47 UNIQUE (email);


--
-- Name: users users_email_key470; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key470 UNIQUE (email);


--
-- Name: users users_email_key471; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key471 UNIQUE (email);


--
-- Name: users users_email_key472; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key472 UNIQUE (email);


--
-- Name: users users_email_key473; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key473 UNIQUE (email);


--
-- Name: users users_email_key474; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key474 UNIQUE (email);


--
-- Name: users users_email_key475; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key475 UNIQUE (email);


--
-- Name: users users_email_key476; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key476 UNIQUE (email);


--
-- Name: users users_email_key477; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key477 UNIQUE (email);


--
-- Name: users users_email_key478; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key478 UNIQUE (email);


--
-- Name: users users_email_key479; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key479 UNIQUE (email);


--
-- Name: users users_email_key48; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key48 UNIQUE (email);


--
-- Name: users users_email_key480; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key480 UNIQUE (email);


--
-- Name: users users_email_key481; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key481 UNIQUE (email);


--
-- Name: users users_email_key482; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key482 UNIQUE (email);


--
-- Name: users users_email_key483; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key483 UNIQUE (email);


--
-- Name: users users_email_key484; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key484 UNIQUE (email);


--
-- Name: users users_email_key485; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key485 UNIQUE (email);


--
-- Name: users users_email_key486; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key486 UNIQUE (email);


--
-- Name: users users_email_key487; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key487 UNIQUE (email);


--
-- Name: users users_email_key488; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key488 UNIQUE (email);


--
-- Name: users users_email_key489; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key489 UNIQUE (email);


--
-- Name: users users_email_key49; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key49 UNIQUE (email);


--
-- Name: users users_email_key490; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key490 UNIQUE (email);


--
-- Name: users users_email_key491; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key491 UNIQUE (email);


--
-- Name: users users_email_key492; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key492 UNIQUE (email);


--
-- Name: users users_email_key493; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key493 UNIQUE (email);


--
-- Name: users users_email_key494; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key494 UNIQUE (email);


--
-- Name: users users_email_key495; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key495 UNIQUE (email);


--
-- Name: users users_email_key496; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key496 UNIQUE (email);


--
-- Name: users users_email_key497; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key497 UNIQUE (email);


--
-- Name: users users_email_key498; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key498 UNIQUE (email);


--
-- Name: users users_email_key499; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key499 UNIQUE (email);


--
-- Name: users users_email_key5; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key5 UNIQUE (email);


--
-- Name: users users_email_key50; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key50 UNIQUE (email);


--
-- Name: users users_email_key500; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key500 UNIQUE (email);


--
-- Name: users users_email_key501; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key501 UNIQUE (email);


--
-- Name: users users_email_key502; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key502 UNIQUE (email);


--
-- Name: users users_email_key503; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key503 UNIQUE (email);


--
-- Name: users users_email_key504; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key504 UNIQUE (email);


--
-- Name: users users_email_key505; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key505 UNIQUE (email);


--
-- Name: users users_email_key506; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key506 UNIQUE (email);


--
-- Name: users users_email_key507; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key507 UNIQUE (email);


--
-- Name: users users_email_key508; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key508 UNIQUE (email);


--
-- Name: users users_email_key509; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key509 UNIQUE (email);


--
-- Name: users users_email_key51; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key51 UNIQUE (email);


--
-- Name: users users_email_key510; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key510 UNIQUE (email);


--
-- Name: users users_email_key511; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key511 UNIQUE (email);


--
-- Name: users users_email_key512; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key512 UNIQUE (email);


--
-- Name: users users_email_key513; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key513 UNIQUE (email);


--
-- Name: users users_email_key514; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key514 UNIQUE (email);


--
-- Name: users users_email_key515; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key515 UNIQUE (email);


--
-- Name: users users_email_key516; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key516 UNIQUE (email);


--
-- Name: users users_email_key517; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key517 UNIQUE (email);


--
-- Name: users users_email_key518; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key518 UNIQUE (email);


--
-- Name: users users_email_key519; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key519 UNIQUE (email);


--
-- Name: users users_email_key52; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key52 UNIQUE (email);


--
-- Name: users users_email_key520; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key520 UNIQUE (email);


--
-- Name: users users_email_key521; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key521 UNIQUE (email);


--
-- Name: users users_email_key522; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key522 UNIQUE (email);


--
-- Name: users users_email_key523; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key523 UNIQUE (email);


--
-- Name: users users_email_key524; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key524 UNIQUE (email);


--
-- Name: users users_email_key525; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key525 UNIQUE (email);


--
-- Name: users users_email_key526; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key526 UNIQUE (email);


--
-- Name: users users_email_key527; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key527 UNIQUE (email);


--
-- Name: users users_email_key528; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key528 UNIQUE (email);


--
-- Name: users users_email_key529; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key529 UNIQUE (email);


--
-- Name: users users_email_key53; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key53 UNIQUE (email);


--
-- Name: users users_email_key530; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key530 UNIQUE (email);


--
-- Name: users users_email_key531; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key531 UNIQUE (email);


--
-- Name: users users_email_key532; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key532 UNIQUE (email);


--
-- Name: users users_email_key533; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key533 UNIQUE (email);


--
-- Name: users users_email_key534; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key534 UNIQUE (email);


--
-- Name: users users_email_key535; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key535 UNIQUE (email);


--
-- Name: users users_email_key536; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key536 UNIQUE (email);


--
-- Name: users users_email_key537; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key537 UNIQUE (email);


--
-- Name: users users_email_key538; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key538 UNIQUE (email);


--
-- Name: users users_email_key539; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key539 UNIQUE (email);


--
-- Name: users users_email_key54; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key54 UNIQUE (email);


--
-- Name: users users_email_key540; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key540 UNIQUE (email);


--
-- Name: users users_email_key541; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key541 UNIQUE (email);


--
-- Name: users users_email_key542; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key542 UNIQUE (email);


--
-- Name: users users_email_key543; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key543 UNIQUE (email);


--
-- Name: users users_email_key544; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key544 UNIQUE (email);


--
-- Name: users users_email_key545; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key545 UNIQUE (email);


--
-- Name: users users_email_key546; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key546 UNIQUE (email);


--
-- Name: users users_email_key547; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key547 UNIQUE (email);


--
-- Name: users users_email_key548; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key548 UNIQUE (email);


--
-- Name: users users_email_key549; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key549 UNIQUE (email);


--
-- Name: users users_email_key55; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key55 UNIQUE (email);


--
-- Name: users users_email_key550; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key550 UNIQUE (email);


--
-- Name: users users_email_key551; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key551 UNIQUE (email);


--
-- Name: users users_email_key552; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key552 UNIQUE (email);


--
-- Name: users users_email_key553; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key553 UNIQUE (email);


--
-- Name: users users_email_key554; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key554 UNIQUE (email);


--
-- Name: users users_email_key555; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key555 UNIQUE (email);


--
-- Name: users users_email_key556; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key556 UNIQUE (email);


--
-- Name: users users_email_key557; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key557 UNIQUE (email);


--
-- Name: users users_email_key558; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key558 UNIQUE (email);


--
-- Name: users users_email_key559; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key559 UNIQUE (email);


--
-- Name: users users_email_key56; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key56 UNIQUE (email);


--
-- Name: users users_email_key560; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key560 UNIQUE (email);


--
-- Name: users users_email_key561; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key561 UNIQUE (email);


--
-- Name: users users_email_key562; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key562 UNIQUE (email);


--
-- Name: users users_email_key563; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key563 UNIQUE (email);


--
-- Name: users users_email_key564; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key564 UNIQUE (email);


--
-- Name: users users_email_key565; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key565 UNIQUE (email);


--
-- Name: users users_email_key566; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key566 UNIQUE (email);


--
-- Name: users users_email_key567; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key567 UNIQUE (email);


--
-- Name: users users_email_key568; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key568 UNIQUE (email);


--
-- Name: users users_email_key569; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key569 UNIQUE (email);


--
-- Name: users users_email_key57; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key57 UNIQUE (email);


--
-- Name: users users_email_key570; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key570 UNIQUE (email);


--
-- Name: users users_email_key571; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key571 UNIQUE (email);


--
-- Name: users users_email_key572; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key572 UNIQUE (email);


--
-- Name: users users_email_key573; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key573 UNIQUE (email);


--
-- Name: users users_email_key574; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key574 UNIQUE (email);


--
-- Name: users users_email_key575; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key575 UNIQUE (email);


--
-- Name: users users_email_key576; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key576 UNIQUE (email);


--
-- Name: users users_email_key577; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key577 UNIQUE (email);


--
-- Name: users users_email_key578; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key578 UNIQUE (email);


--
-- Name: users users_email_key579; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key579 UNIQUE (email);


--
-- Name: users users_email_key58; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key58 UNIQUE (email);


--
-- Name: users users_email_key580; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key580 UNIQUE (email);


--
-- Name: users users_email_key581; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key581 UNIQUE (email);


--
-- Name: users users_email_key582; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key582 UNIQUE (email);


--
-- Name: users users_email_key583; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key583 UNIQUE (email);


--
-- Name: users users_email_key584; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key584 UNIQUE (email);


--
-- Name: users users_email_key585; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key585 UNIQUE (email);


--
-- Name: users users_email_key586; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key586 UNIQUE (email);


--
-- Name: users users_email_key587; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key587 UNIQUE (email);


--
-- Name: users users_email_key588; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key588 UNIQUE (email);


--
-- Name: users users_email_key589; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key589 UNIQUE (email);


--
-- Name: users users_email_key59; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key59 UNIQUE (email);


--
-- Name: users users_email_key590; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key590 UNIQUE (email);


--
-- Name: users users_email_key591; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key591 UNIQUE (email);


--
-- Name: users users_email_key592; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key592 UNIQUE (email);


--
-- Name: users users_email_key593; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key593 UNIQUE (email);


--
-- Name: users users_email_key594; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key594 UNIQUE (email);


--
-- Name: users users_email_key595; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key595 UNIQUE (email);


--
-- Name: users users_email_key596; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key596 UNIQUE (email);


--
-- Name: users users_email_key597; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key597 UNIQUE (email);


--
-- Name: users users_email_key598; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key598 UNIQUE (email);


--
-- Name: users users_email_key599; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key599 UNIQUE (email);


--
-- Name: users users_email_key6; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key6 UNIQUE (email);


--
-- Name: users users_email_key60; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key60 UNIQUE (email);


--
-- Name: users users_email_key600; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key600 UNIQUE (email);


--
-- Name: users users_email_key601; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key601 UNIQUE (email);


--
-- Name: users users_email_key602; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key602 UNIQUE (email);


--
-- Name: users users_email_key603; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key603 UNIQUE (email);


--
-- Name: users users_email_key604; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key604 UNIQUE (email);


--
-- Name: users users_email_key605; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key605 UNIQUE (email);


--
-- Name: users users_email_key606; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key606 UNIQUE (email);


--
-- Name: users users_email_key607; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key607 UNIQUE (email);


--
-- Name: users users_email_key608; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key608 UNIQUE (email);


--
-- Name: users users_email_key609; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key609 UNIQUE (email);


--
-- Name: users users_email_key61; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key61 UNIQUE (email);


--
-- Name: users users_email_key610; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key610 UNIQUE (email);


--
-- Name: users users_email_key611; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key611 UNIQUE (email);


--
-- Name: users users_email_key612; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key612 UNIQUE (email);


--
-- Name: users users_email_key613; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key613 UNIQUE (email);


--
-- Name: users users_email_key614; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key614 UNIQUE (email);


--
-- Name: users users_email_key615; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key615 UNIQUE (email);


--
-- Name: users users_email_key616; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key616 UNIQUE (email);


--
-- Name: users users_email_key617; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key617 UNIQUE (email);


--
-- Name: users users_email_key618; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key618 UNIQUE (email);


--
-- Name: users users_email_key619; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key619 UNIQUE (email);


--
-- Name: users users_email_key62; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key62 UNIQUE (email);


--
-- Name: users users_email_key620; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key620 UNIQUE (email);


--
-- Name: users users_email_key621; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key621 UNIQUE (email);


--
-- Name: users users_email_key622; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key622 UNIQUE (email);


--
-- Name: users users_email_key623; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key623 UNIQUE (email);


--
-- Name: users users_email_key624; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key624 UNIQUE (email);


--
-- Name: users users_email_key625; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key625 UNIQUE (email);


--
-- Name: users users_email_key626; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key626 UNIQUE (email);


--
-- Name: users users_email_key627; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key627 UNIQUE (email);


--
-- Name: users users_email_key628; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key628 UNIQUE (email);


--
-- Name: users users_email_key629; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key629 UNIQUE (email);


--
-- Name: users users_email_key63; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key63 UNIQUE (email);


--
-- Name: users users_email_key630; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key630 UNIQUE (email);


--
-- Name: users users_email_key631; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key631 UNIQUE (email);


--
-- Name: users users_email_key632; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key632 UNIQUE (email);


--
-- Name: users users_email_key633; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key633 UNIQUE (email);


--
-- Name: users users_email_key634; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key634 UNIQUE (email);


--
-- Name: users users_email_key635; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key635 UNIQUE (email);


--
-- Name: users users_email_key636; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key636 UNIQUE (email);


--
-- Name: users users_email_key637; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key637 UNIQUE (email);


--
-- Name: users users_email_key638; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key638 UNIQUE (email);


--
-- Name: users users_email_key639; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key639 UNIQUE (email);


--
-- Name: users users_email_key64; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key64 UNIQUE (email);


--
-- Name: users users_email_key640; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key640 UNIQUE (email);


--
-- Name: users users_email_key641; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key641 UNIQUE (email);


--
-- Name: users users_email_key642; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key642 UNIQUE (email);


--
-- Name: users users_email_key643; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key643 UNIQUE (email);


--
-- Name: users users_email_key65; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key65 UNIQUE (email);


--
-- Name: users users_email_key66; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key66 UNIQUE (email);


--
-- Name: users users_email_key67; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key67 UNIQUE (email);


--
-- Name: users users_email_key68; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key68 UNIQUE (email);


--
-- Name: users users_email_key69; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key69 UNIQUE (email);


--
-- Name: users users_email_key7; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key7 UNIQUE (email);


--
-- Name: users users_email_key70; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key70 UNIQUE (email);


--
-- Name: users users_email_key71; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key71 UNIQUE (email);


--
-- Name: users users_email_key72; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key72 UNIQUE (email);


--
-- Name: users users_email_key73; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key73 UNIQUE (email);


--
-- Name: users users_email_key74; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key74 UNIQUE (email);


--
-- Name: users users_email_key75; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key75 UNIQUE (email);


--
-- Name: users users_email_key76; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key76 UNIQUE (email);


--
-- Name: users users_email_key77; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key77 UNIQUE (email);


--
-- Name: users users_email_key78; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key78 UNIQUE (email);


--
-- Name: users users_email_key79; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key79 UNIQUE (email);


--
-- Name: users users_email_key8; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key8 UNIQUE (email);


--
-- Name: users users_email_key80; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key80 UNIQUE (email);


--
-- Name: users users_email_key81; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key81 UNIQUE (email);


--
-- Name: users users_email_key82; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key82 UNIQUE (email);


--
-- Name: users users_email_key83; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key83 UNIQUE (email);


--
-- Name: users users_email_key84; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key84 UNIQUE (email);


--
-- Name: users users_email_key85; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key85 UNIQUE (email);


--
-- Name: users users_email_key86; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key86 UNIQUE (email);


--
-- Name: users users_email_key87; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key87 UNIQUE (email);


--
-- Name: users users_email_key88; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key88 UNIQUE (email);


--
-- Name: users users_email_key89; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key89 UNIQUE (email);


--
-- Name: users users_email_key9; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key9 UNIQUE (email);


--
-- Name: users users_email_key90; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key90 UNIQUE (email);


--
-- Name: users users_email_key91; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key91 UNIQUE (email);


--
-- Name: users users_email_key92; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key92 UNIQUE (email);


--
-- Name: users users_email_key93; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key93 UNIQUE (email);


--
-- Name: users users_email_key94; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key94 UNIQUE (email);


--
-- Name: users users_email_key95; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key95 UNIQUE (email);


--
-- Name: users users_email_key96; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key96 UNIQUE (email);


--
-- Name: users users_email_key97; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key97 UNIQUE (email);


--
-- Name: users users_email_key98; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key98 UNIQUE (email);


--
-- Name: users users_email_key99; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key99 UNIQUE (email);


--
-- Name: users users_emp_no_key; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key UNIQUE (emp_no);


--
-- Name: users users_emp_no_key1; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key1 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key10; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key10 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key100; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key100 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key101; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key101 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key102; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key102 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key103; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key103 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key104; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key104 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key105; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key105 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key106; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key106 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key107; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key107 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key108; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key108 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key109; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key109 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key11; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key11 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key110; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key110 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key111; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key111 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key112; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key112 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key113; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key113 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key114; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key114 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key115; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key115 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key116; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key116 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key117; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key117 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key118; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key118 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key119; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key119 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key12; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key12 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key120; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key120 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key121; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key121 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key122; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key122 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key123; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key123 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key124; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key124 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key125; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key125 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key126; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key126 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key127; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key127 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key128; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key128 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key129; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key129 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key13; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key13 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key130; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key130 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key131; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key131 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key132; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key132 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key133; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key133 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key134; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key134 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key135; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key135 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key136; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key136 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key137; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key137 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key138; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key138 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key139; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key139 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key14; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key14 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key140; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key140 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key141; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key141 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key142; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key142 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key143; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key143 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key144; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key144 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key145; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key145 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key146; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key146 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key147; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key147 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key148; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key148 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key149; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key149 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key15; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key15 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key150; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key150 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key151; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key151 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key152; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key152 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key153; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key153 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key154; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key154 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key155; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key155 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key156; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key156 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key157; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key157 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key158; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key158 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key159; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key159 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key16; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key16 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key160; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key160 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key161; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key161 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key162; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key162 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key163; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key163 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key164; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key164 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key165; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key165 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key166; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key166 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key167; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key167 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key168; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key168 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key169; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key169 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key17; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key17 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key170; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key170 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key171; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key171 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key172; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key172 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key173; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key173 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key174; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key174 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key175; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key175 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key176; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key176 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key177; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key177 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key178; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key178 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key179; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key179 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key18; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key18 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key180; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key180 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key181; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key181 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key182; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key182 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key183; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key183 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key184; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key184 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key185; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key185 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key186; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key186 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key187; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key187 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key188; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key188 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key189; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key189 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key19; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key19 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key190; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key190 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key191; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key191 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key192; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key192 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key193; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key193 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key194; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key194 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key195; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key195 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key196; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key196 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key197; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key197 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key198; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key198 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key199; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key199 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key2; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key2 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key20; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key20 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key200; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key200 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key201; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key201 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key202; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key202 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key203; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key203 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key204; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key204 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key205; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key205 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key206; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key206 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key207; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key207 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key208; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key208 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key209; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key209 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key21; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key21 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key210; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key210 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key211; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key211 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key212; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key212 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key213; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key213 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key214; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key214 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key215; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key215 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key216; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key216 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key217; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key217 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key218; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key218 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key219; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key219 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key22; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key22 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key220; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key220 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key221; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key221 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key222; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key222 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key223; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key223 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key224; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key224 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key225; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key225 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key226; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key226 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key227; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key227 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key228; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key228 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key229; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key229 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key23; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key23 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key230; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key230 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key231; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key231 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key232; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key232 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key233; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key233 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key234; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key234 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key235; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key235 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key236; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key236 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key237; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key237 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key238; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key238 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key239; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key239 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key24; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key24 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key240; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key240 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key241; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key241 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key242; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key242 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key243; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key243 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key244; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key244 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key245; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key245 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key246; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key246 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key247; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key247 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key248; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key248 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key249; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key249 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key25; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key25 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key250; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key250 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key251; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key251 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key252; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key252 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key253; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key253 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key254; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key254 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key255; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key255 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key256; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key256 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key257; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key257 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key258; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key258 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key259; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key259 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key26; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key26 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key260; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key260 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key261; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key261 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key262; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key262 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key263; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key263 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key264; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key264 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key265; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key265 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key266; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key266 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key267; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key267 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key268; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key268 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key269; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key269 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key27; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key27 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key270; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key270 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key271; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key271 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key272; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key272 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key273; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key273 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key274; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key274 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key275; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key275 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key276; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key276 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key277; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key277 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key278; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key278 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key279; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key279 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key28; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key28 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key280; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key280 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key281; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key281 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key282; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key282 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key283; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key283 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key284; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key284 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key285; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key285 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key286; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key286 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key287; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key287 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key288; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key288 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key289; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key289 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key29; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key29 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key290; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key290 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key291; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key291 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key292; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key292 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key293; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key293 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key294; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key294 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key295; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key295 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key296; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key296 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key297; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key297 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key298; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key298 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key299; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key299 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key3; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key3 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key30; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key30 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key300; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key300 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key301; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key301 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key302; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key302 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key303; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key303 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key304; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key304 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key305; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key305 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key306; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key306 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key307; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key307 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key308; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key308 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key309; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key309 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key31; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key31 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key310; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key310 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key311; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key311 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key312; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key312 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key313; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key313 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key314; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key314 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key315; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key315 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key316; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key316 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key317; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key317 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key318; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key318 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key319; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key319 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key32; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key32 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key320; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key320 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key321; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key321 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key322; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key322 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key323; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key323 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key324; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key324 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key325; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key325 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key326; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key326 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key327; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key327 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key328; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key328 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key329; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key329 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key33; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key33 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key330; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key330 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key331; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key331 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key332; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key332 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key333; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key333 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key334; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key334 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key335; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key335 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key336; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key336 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key337; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key337 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key338; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key338 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key339; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key339 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key34; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key34 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key340; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key340 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key341; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key341 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key342; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key342 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key343; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key343 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key344; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key344 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key345; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key345 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key346; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key346 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key347; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key347 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key348; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key348 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key349; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key349 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key35; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key35 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key350; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key350 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key351; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key351 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key352; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key352 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key353; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key353 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key354; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key354 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key355; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key355 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key356; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key356 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key357; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key357 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key358; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key358 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key359; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key359 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key36; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key36 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key360; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key360 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key361; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key361 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key362; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key362 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key363; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key363 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key364; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key364 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key365; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key365 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key366; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key366 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key367; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key367 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key368; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key368 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key369; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key369 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key37; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key37 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key370; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key370 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key371; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key371 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key372; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key372 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key373; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key373 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key374; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key374 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key375; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key375 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key376; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key376 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key377; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key377 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key378; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key378 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key379; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key379 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key38; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key38 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key380; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key380 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key381; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key381 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key382; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key382 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key383; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key383 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key384; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key384 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key385; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key385 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key386; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key386 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key387; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key387 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key388; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key388 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key389; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key389 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key39; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key39 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key390; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key390 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key391; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key391 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key392; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key392 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key393; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key393 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key394; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key394 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key395; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key395 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key396; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key396 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key397; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key397 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key398; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key398 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key399; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key399 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key4; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key4 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key40; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key40 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key400; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key400 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key401; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key401 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key402; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key402 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key403; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key403 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key404; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key404 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key405; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key405 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key406; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key406 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key407; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key407 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key408; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key408 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key409; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key409 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key41; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key41 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key410; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key410 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key411; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key411 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key412; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key412 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key413; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key413 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key414; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key414 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key415; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key415 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key416; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key416 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key417; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key417 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key418; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key418 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key419; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key419 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key42; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key42 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key420; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key420 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key421; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key421 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key422; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key422 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key423; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key423 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key424; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key424 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key425; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key425 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key426; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key426 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key427; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key427 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key428; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key428 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key429; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key429 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key43; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key43 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key430; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key430 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key431; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key431 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key432; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key432 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key433; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key433 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key434; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key434 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key435; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key435 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key436; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key436 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key437; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key437 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key438; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key438 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key439; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key439 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key44; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key44 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key440; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key440 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key441; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key441 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key442; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key442 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key443; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key443 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key444; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key444 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key445; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key445 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key446; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key446 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key447; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key447 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key448; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key448 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key449; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key449 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key45; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key45 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key450; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key450 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key451; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key451 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key452; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key452 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key453; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key453 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key454; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key454 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key455; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key455 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key456; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key456 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key457; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key457 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key458; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key458 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key459; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key459 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key46; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key46 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key460; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key460 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key461; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key461 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key462; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key462 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key463; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key463 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key464; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key464 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key465; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key465 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key466; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key466 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key467; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key467 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key468; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key468 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key469; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key469 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key47; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key47 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key470; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key470 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key471; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key471 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key472; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key472 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key473; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key473 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key474; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key474 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key475; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key475 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key476; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key476 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key477; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key477 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key478; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key478 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key479; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key479 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key48; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key48 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key480; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key480 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key481; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key481 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key482; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key482 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key483; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key483 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key484; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key484 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key485; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key485 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key486; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key486 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key487; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key487 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key488; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key488 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key489; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key489 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key49; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key49 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key490; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key490 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key491; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key491 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key492; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key492 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key493; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key493 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key494; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key494 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key495; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key495 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key496; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key496 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key497; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key497 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key498; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key498 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key499; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key499 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key5; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key5 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key50; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key50 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key500; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key500 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key501; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key501 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key502; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key502 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key503; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key503 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key504; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key504 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key505; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key505 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key506; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key506 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key507; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key507 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key508; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key508 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key509; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key509 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key51; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key51 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key510; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key510 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key511; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key511 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key512; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key512 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key513; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key513 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key514; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key514 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key515; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key515 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key516; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key516 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key517; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key517 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key518; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key518 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key519; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key519 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key52; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key52 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key520; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key520 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key521; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key521 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key522; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key522 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key523; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key523 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key524; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key524 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key525; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key525 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key526; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key526 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key527; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key527 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key528; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key528 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key529; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key529 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key53; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key53 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key530; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key530 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key531; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key531 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key532; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key532 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key533; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key533 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key534; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key534 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key535; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key535 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key536; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key536 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key537; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key537 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key538; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key538 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key539; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key539 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key54; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key54 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key540; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key540 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key541; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key541 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key542; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key542 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key543; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key543 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key544; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key544 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key545; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key545 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key546; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key546 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key547; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key547 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key548; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key548 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key549; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key549 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key55; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key55 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key550; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key550 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key551; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key551 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key552; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key552 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key553; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key553 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key554; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key554 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key555; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key555 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key556; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key556 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key557; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key557 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key558; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key558 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key559; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key559 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key56; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key56 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key560; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key560 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key561; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key561 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key562; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key562 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key563; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key563 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key564; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key564 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key565; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key565 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key566; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key566 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key567; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key567 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key568; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key568 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key569; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key569 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key57; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key57 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key570; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key570 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key571; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key571 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key572; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key572 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key573; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key573 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key574; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key574 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key575; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key575 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key576; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key576 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key577; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key577 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key578; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key578 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key579; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key579 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key58; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key58 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key580; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key580 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key581; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key581 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key582; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key582 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key583; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key583 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key584; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key584 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key585; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key585 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key586; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key586 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key587; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key587 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key588; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key588 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key589; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key589 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key59; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key59 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key590; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key590 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key591; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key591 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key592; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key592 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key593; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key593 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key594; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key594 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key595; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key595 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key596; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key596 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key597; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key597 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key598; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key598 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key599; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key599 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key6; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key6 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key60; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key60 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key600; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key600 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key601; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key601 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key602; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key602 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key603; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key603 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key604; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key604 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key605; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key605 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key606; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key606 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key607; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key607 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key608; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key608 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key609; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key609 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key61; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key61 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key610; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key610 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key611; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key611 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key612; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key612 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key613; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key613 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key614; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key614 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key615; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key615 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key616; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key616 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key617; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key617 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key618; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key618 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key619; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key619 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key62; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key62 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key620; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key620 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key621; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key621 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key622; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key622 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key623; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key623 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key624; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key624 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key625; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key625 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key626; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key626 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key627; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key627 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key628; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key628 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key629; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key629 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key63; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key63 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key630; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key630 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key631; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key631 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key632; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key632 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key633; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key633 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key64; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key64 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key65; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key65 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key66; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key66 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key67; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key67 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key68; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key68 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key69; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key69 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key7; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key7 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key70; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key70 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key71; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key71 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key72; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key72 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key73; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key73 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key74; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key74 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key75; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key75 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key76; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key76 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key77; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key77 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key78; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key78 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key79; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key79 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key8; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key8 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key80; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key80 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key81; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key81 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key82; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key82 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key83; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key83 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key84; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key84 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key85; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key85 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key86; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key86 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key87; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key87 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key88; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key88 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key89; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key89 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key9; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key9 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key90; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key90 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key91; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key91 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key92; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key92 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key93; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key93 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key94; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key94 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key95; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key95 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key96; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key96 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key97; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key97 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key98; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key98 UNIQUE (emp_no);


--
-- Name: users users_emp_no_key99; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emp_no_key99 UNIQUE (emp_no);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: PerformaInvoiceStatuses PerformaInvoiceStatuses_performaInvoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."PerformaInvoiceStatuses"
    ADD CONSTRAINT "PerformaInvoiceStatuses_performaInvoiceId_fkey" FOREIGN KEY ("performaInvoiceId") REFERENCES public."PerformaInvoices"(id) ON UPDATE CASCADE;


--
-- Name: PerformaInvoices PerformaInvoices_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."PerformaInvoices"
    ADD CONSTRAINT "PerformaInvoices_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public.company(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PerformaInvoices PerformaInvoices_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."PerformaInvoices"
    ADD CONSTRAINT "PerformaInvoices_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public.company(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: performaInvoices performaInvoices_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."performaInvoices"
    ADD CONSTRAINT "performaInvoices_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public.company(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: performaInvoices performaInvoices_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."performaInvoices"
    ADD CONSTRAINT "performaInvoices_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public.company(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

