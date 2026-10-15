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
    "updatedAt" timestamp with time zone NOT NULL,
    "qualifiedSupplierId" uuid,
    "supplierCompanyId" integer,
    "supplierProfileId" character varying(255),
    "isSupplierQualified" boolean DEFAULT false
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
    "updatedAt" timestamp with time zone NOT NULL,
    "isNotQualified" boolean DEFAULT false
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
-- Name: PerformaInvoiceStatuses id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."PerformaInvoiceStatuses" ALTER COLUMN id SET DEFAULT nextval('public."PerformaInvoiceStatuses_id_seq"'::regclass);


--
-- Name: PerformaInvoices id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."PerformaInvoices" ALTER COLUMN id SET DEFAULT nextval('public."PerformaInvoices_id_seq"'::regclass);


--
-- Name: company id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company ALTER COLUMN id SET DEFAULT nextval('public.company_id_seq'::regclass);


--
-- Data for Name: PerformaInvoiceStatuses; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."PerformaInvoiceStatuses" (id, "performaInvoiceId", status, date, comment, "changedBy", "createdAt", "updatedAt") FROM stdin;
1	1	GENERATED	2026-07-29 15:51:24.538+05:30	\N	\N	2026-07-29 15:51:24.539+05:30	2026-07-29 15:51:24.539+05:30
2	2	GENERATED	2026-07-29 15:54:40.676+05:30	\N	\N	2026-07-29 15:54:40.677+05:30	2026-07-29 15:54:40.677+05:30
3	3	GENERATED	2026-07-29 16:28:14.948+05:30	\N	\N	2026-07-29 16:28:14.948+05:30	2026-07-29 16:28:14.948+05:30
4	4	GENERATED	2026-07-29 16:29:54.02+05:30	\N	\N	2026-07-29 16:29:54.02+05:30	2026-07-29 16:29:54.02+05:30
5	5	GENERATED	2026-07-29 16:34:16.7+05:30	\N	\N	2026-07-29 16:34:16.7+05:30	2026-07-29 16:34:16.7+05:30
6	6	GENERATED	2026-07-29 16:35:42.681+05:30	\N	\N	2026-07-29 16:35:42.682+05:30	2026-07-29 16:35:42.682+05:30
7	7	GENERATED	2026-07-29 16:38:00.952+05:30	\N	\N	2026-07-29 16:38:00.952+05:30	2026-07-29 16:38:00.952+05:30
8	8	GENERATED	2026-07-29 17:45:31.422+05:30	\N	\N	2026-07-29 17:45:31.422+05:30	2026-07-29 17:45:31.422+05:30
9	9	GENERATED	2026-07-29 17:49:59.873+05:30	\N	\N	2026-07-29 17:49:59.873+05:30	2026-07-29 17:49:59.873+05:30
10	10	GENERATED	2026-07-31 13:24:36.881+05:30	\N	\N	2026-07-31 13:24:36.882+05:30	2026-07-31 13:24:36.882+05:30
11	11	GENERATED	2026-07-31 13:52:45.49+05:30	\N	\N	2026-07-31 13:52:45.491+05:30	2026-07-31 13:52:45.491+05:30
12	12	GENERATED	2026-07-31 14:42:07.093+05:30	\N	\N	2026-07-31 14:42:07.093+05:30	2026-07-31 14:42:07.093+05:30
13	13	GENERATED	2026-07-31 15:07:27.819+05:30	\N	\N	2026-07-31 15:07:27.819+05:30	2026-07-31 15:07:27.819+05:30
14	14	GENERATED	2026-08-07 10:12:48.273+05:30	\N	\N	2026-08-07 10:12:48.273+05:30	2026-08-07 10:12:48.273+05:30
15	15	GENERATED	2026-08-07 14:34:19.725+05:30	\N	\N	2026-08-07 14:34:19.726+05:30	2026-08-07 14:34:19.726+05:30
\.


--
-- Data for Name: PerformaInvoices; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."PerformaInvoices" (id, "piNo", url, "bankSlip", status, "salesPersonId", "kamId", "amId", "accountantId", count, "supplierId", "supplierSoNo", "supplierPoNo", "supplierCurrency", "supplierPrice", "customerId", "customerSoNo", "customerPoNo", "customerCurrency", "poValue", "paymentMode", purpose, "addedById", notes, "createdAt", "updatedAt", "qualifiedSupplierId", "supplierCompanyId", "supplierProfileId", "isSupplierQualified") FROM stdin;
1	E-001	{"{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/8bcd71cd-c937-4a9a-beaa-e32f28044096.pdf\\",\\"remarks\\":\\"f\\"}"}	\N	GENERATED	7	6	\N	\N	1	3	34	po7	Dollar	400	\N			Dollar	\N	WireTransfer	Stock	7		2026-07-29 15:51:24.508+05:30	2026-07-29 15:51:24.508+05:30	\N	3	89eda6e7-af83-48b6-a4e9-5befedf259b1	f
2	E-002	{"{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/28ddc492-739c-4455-8f2a-8fe8e4f89984.pdf\\",\\"remarks\\":\\"\\"}"}	\N	GENERATED	7	6	\N	\N	1	2	12	3	Dollar	300	\N			Dollar	\N	WireTransfer	Stock	7	rty	2026-07-29 15:54:40.669+05:30	2026-07-29 15:54:40.669+05:30	\N	2	2	f
3	E-003	{"{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/45497896-2c56-4837-b85b-bd469337299a.pdf\\",\\"remarks\\":\\"b\\"}","{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/155bf559-0a06-4c6d-9bc9-187d410cf908.pdf\\",\\"remarks\\":\\"t\\"}"}	\N	GENERATED	7	6	\N	\N	1	2	de3	po	Dollar	6	\N			Dollar	\N	WireTransfer	Stock	7	b	2026-07-29 16:28:14.927+05:30	2026-07-29 16:28:14.927+05:30	\N	2	\N	t
4	E-004	{"{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/efec8e36-7d85-4317-b852-c3e8636951d8.pdf\\",\\"remarks\\":\\"r\\"}"}	\N	GENERATED	7	6	\N	\N	1	2	5	po4	Dollar	2	\N			Dollar	\N	WireTransfer	Stock	7	r	2026-07-29 16:29:54.015+05:30	2026-07-29 16:29:54.015+05:30	\N	2	\N	t
5	E-005	{"{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/bf7074db-6025-458f-8ac5-49b350fed89c.pdf\\",\\"remarks\\":\\"g\\"}"}	\N	GENERATED	7	6	\N	\N	1	3	6	4	Dollar	4	\N			Dollar	\N	WireTransfer	Stock	7	f	2026-07-29 16:34:16.691+05:30	2026-07-29 16:34:16.691+05:30	\N	3	89eda6e7-af83-48b6-a4e9-5befedf259b1	t
6	E-006	{"{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/7192d1f1-2ffc-4201-beef-e613e3fa27e6.pdf\\",\\"remarks\\":\\"\\"}"}	\N	GENERATED	7	6	\N	\N	1	3	6	po	Dollar	398	\N			Dollar	\N	WireTransfer	Stock	7	f	2026-07-29 16:35:42.659+05:30	2026-07-29 16:35:42.659+05:30	\N	3	89eda6e7-af83-48b6-a4e9-5befedf259b1	t
7	E-007	{"{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/5c425016-aa05-4550-8509-5e7fd9feb3e8.pdf\\",\\"remarks\\":\\"\\"}"}	\N	GENERATED	7	6	\N	\N	1	3	sa12	po90	Dollar	4	\N			Dollar	\N	WireTransfer	Stock	7	yu	2026-07-29 16:38:00.93+05:30	2026-07-29 16:38:00.93+05:30	\N	3	89eda6e7-af83-48b6-a4e9-5befedf259b1	t
8	E-008	{"{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/2039af58-a2f3-45e5-a057-c6f6208b4b85.pdf\\",\\"remarks\\":\\"gh\\"}"}	\N	GENERATED	7	6	\N	\N	1	3	s2	p2	Dollar	699	\N			Dollar	\N	WireTransfer	Stock	7	yu	2026-07-29 17:45:31.399+05:30	2026-07-29 17:45:31.399+05:30	\N	3	89eda6e7-af83-48b6-a4e9-5befedf259b1	t
9	E-009	{"{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/eb6c2dbf-92bd-4533-bfeb-20fc677152d0.pdf\\",\\"remarks\\":\\"j\\"}"}	\N	GENERATED	7	6	\N	\N	1	3	u7	9o	Dollar	698	\N			Dollar	\N	WireTransfer	Stock	7	yui	2026-07-29 17:49:59.853+05:30	2026-07-29 17:49:59.853+05:30	\N	3	89eda6e7-af83-48b6-a4e9-5befedf259b1	t
10	E-010	{"{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/6cb2119d-92dc-41c6-958e-11e0b7c3ea06.pdf\\",\\"remarks\\":\\"uj\\"}"}	\N	GENERATED	7	6	\N	\N	1	3	sa12	po	Dollar	200	\N			Dollar	\N	WireTransfer	Stock	7	yu	2026-07-31 13:24:36.859+05:30	2026-07-31 13:24:36.859+05:30	\N	\N	\N	f
11	E-011	{"{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/43207b8f-3681-49ee-9d54-98a54c2af419.pdf\\",\\"remarks\\":\\"yui\\"}"}	\N	GENERATED	7	6	\N	\N	1	\N	so6	po9	Dollar	500	\N			Dollar	\N	WireTransfer	Stock	7	yuio	2026-07-31 13:52:45.478+05:30	2026-07-31 13:52:45.478+05:30	\N	\N	\N	f
12	E-012	{"{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/199fb25c-635e-4d58-953b-f72aa568c401.pdf\\",\\"remarks\\":\\"g\\"}","{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/c33c575f-67aa-41ce-a26a-b82a9a59f80f.pdf\\",\\"remarks\\":\\"Doc2\\"}"}	\N	GENERATED	7	6	\N	\N	1	\N	SO12	PO12	Dollar	600	4			Dollar	\N	WireTransfer	Stock	7	yu	2026-07-31 14:42:07.085+05:30	2026-07-31 14:42:07.085+05:30	\N	\N	\N	f
13	E-013	{"{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/c637d07b-e929-4f42-a32d-1dd093ad68ff.pdf\\",\\"remarks\\":\\"uii\\"}"}	\N	GENERATED	7	6	\N	\N	1	\N	SO12	PO12	Dollar	200	5	cso90	cop0	Dollar	500	WireTransfer	Customer	7	yuoo	2026-07-31 15:07:27.815+05:30	2026-07-31 15:07:27.815+05:30	\N	\N	\N	f
14	E-014	{"{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/502ec994-3efb-47ab-b607-85c03e39ab6a.pdf\\",\\"remarks\\":\\"dc1\\"}"}	\N	GENERATED	3	6	\N	\N	1	\N	sa1	po1	Dollar	200	\N			Dollar	\N	WireTransfer	Stock	3	j	2026-08-07 10:12:48.239+05:30	2026-08-07 10:12:48.239+05:30	\N	\N	\N	f
15	E-015	{"{\\"url\\":\\"https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/leeds-webapp/invoices/94f33e6c-9227-40eb-a5b2-4ae33db47a90.pdf\\",\\"remarks\\":\\"D3\\"}"}	\N	GENERATED	7	6	\N	\N	1	\N	SA12	PO12	Dollar	500	\N			Dollar	\N	WireTransfer	Stock	7		2026-08-07 14:34:19.717+05:30	2026-08-07 14:34:19.717+05:30	\N	\N	\N	f
\.


--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public.company (id, "companyName", code, "contactPerson", designation, email, website, "phoneNumber", address1, address2, city, country, state, zipcode, "linkedIn", remarks, customer, supplier, "createdAt", "updatedAt", "isNotQualified") FROM stdin;
2	abc 	abccode	abctest		abctest@gmail.com		123456987123									f	t	2026-07-27 13:11:44.633+05:30	2026-07-27 13:11:44.633+05:30	f
3	ttyyy	ttyyycode	ttyyyperson	\N	ttyyy@gmail.com	\N	12302136478	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	2026-07-28 16:24:34.507+05:30	2026-07-28 16:24:34.507+05:30	f
4	Customer A 	custa	custaperson		custadummy@gmail.com	custadummy.com	12365478902	add1	add1	add1	add1	add1	123654	add1/linkedin	yu	t	f	2026-07-31 14:41:14.106+05:30	2026-07-31 14:41:14.106+05:30	f
5	customerb	customerbcode	customerbperson		customerbdmmyyy@gmail.com	customerbcustomerb.com	12365478990	add1	add1	add1	add1	add1	123654			t	f	2026-07-31 15:06:51.204+05:30	2026-07-31 15:06:51.204+05:30	f
6	Customerc	Customerccode	Customerc	\N	Customercdummy@gmail.com	Customercdummydummy.com	12345698702	add1	add2 	add2 	add2 	add2 	add2 	\N	\N	t	f	2026-07-31 15:13:00.412+05:30	2026-07-31 15:13:00.412+05:30	f
\.


--
-- Name: PerformaInvoiceStatuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."PerformaInvoiceStatuses_id_seq"', 15, true);


--
-- Name: PerformaInvoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."PerformaInvoices_id_seq"', 15, true);


--
-- Name: company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public.company_id_seq', 6, true);


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
-- Name: company company_companyName_key; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "company_companyName_key" UNIQUE ("companyName");


--
-- Name: company company_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (id);


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
-- PostgreSQL database dump complete
--

