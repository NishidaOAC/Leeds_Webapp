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
-- Name: enum_roles_power; Type: TYPE; Schema: public; Owner: oac_softwares
--

CREATE TYPE public.enum_roles_power AS ENUM (
    'Admin',
    'SalesExecutive',
    'KAM',
    'Manager',
    'Accountant'
);


ALTER TYPE public.enum_roles_power OWNER TO oac_softwares;

--
-- Name: enum_user_approvals_status; Type: TYPE; Schema: public; Owner: oac_softwares
--

CREATE TYPE public.enum_user_approvals_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'expired'
);


ALTER TYPE public.enum_user_approvals_status OWNER TO oac_softwares;

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
-- Name: notification; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public.notification (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    message text NOT NULL,
    "isRead" boolean DEFAULT false,
    "createdAt" timestamp with time zone,
    route character varying(255)
);


ALTER TABLE public.notification OWNER TO oac_softwares;

--
-- Name: notification_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public.notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_id_seq OWNER TO oac_softwares;

--
-- Name: notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public.notification_id_seq OWNED BY public.notification.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    "roleName" character varying(255) NOT NULL,
    abbreviation character varying(255) NOT NULL,
    power public.enum_roles_power DEFAULT 'Admin'::public.enum_roles_power NOT NULL,
    description text,
    permissions jsonb DEFAULT '[]'::jsonb,
    "isActive" boolean DEFAULT true,
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
-- Name: user_approvals; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public.user_approvals (
    id integer NOT NULL,
    user_id integer NOT NULL,
    approval_token character varying(255) NOT NULL,
    token_expires timestamp with time zone NOT NULL,
    requested_at timestamp with time zone NOT NULL,
    requested_by integer,
    approved_by integer,
    approved_at timestamp with time zone,
    status public.enum_user_approvals_status DEFAULT 'pending'::public.enum_user_approvals_status,
    approval_notes text,
    rejection_reason text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.user_approvals OWNER TO oac_softwares;

--
-- Name: user_approvals_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public.user_approvals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_approvals_id_seq OWNER TO oac_softwares;

--
-- Name: user_approvals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public.user_approvals_id_seq OWNED BY public.user_approvals.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    "empNo" character varying(255),
    "roleId" integer DEFAULT 1 NOT NULL,
    "isActive" boolean DEFAULT false,
    status public.enum_users_status DEFAULT 'pending_approval'::public.enum_users_status,
    "approvedBy" integer,
    "approvedAt" timestamp with time zone,
    "lastLogin" timestamp with time zone,
    "failedLoginAttempts" integer DEFAULT 0,
    "passwordChangedAt" timestamp with time zone,
    "resetPasswordToken" character varying(255),
    "resetPasswordExpires" timestamp with time zone,
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
-- Name: notification id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.notification ALTER COLUMN id SET DEFAULT nextval('public.notification_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: user_approvals id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.user_approvals ALTER COLUMN id SET DEFAULT nextval('public.user_approvals_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: Team; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."Team" (id, "teamName", "createdAt", "updatedAt") FROM stdin;
1	TeamA	2026-01-20 15:56:12.701+05:30	2026-01-20 16:02:59.432+05:30
\.


--
-- Data for Name: TeamLeader; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."TeamLeader" (id, "teamId", "userId", "createdAt", "updatedAt") FROM stdin;
2	1	2	2026-01-20 16:02:59.441+05:30	2026-01-20 16:02:59.441+05:30
\.


--
-- Data for Name: TeamMember; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."TeamMember" (id, "teamId", "userId", "createdAt", "updatedAt") FROM stdin;
3	1	1	2026-01-20 16:02:59.447+05:30	2026-01-20 16:02:59.447+05:30
4	1	3	2026-01-20 16:02:59.447+05:30	2026-01-20 16:02:59.447+05:30
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."Users" (id, email, password, name, emp_no, role_id, is_active, status, approved_by, approved_at, last_login, failed_login_attempts, password_changed_at, reset_password_token, reset_password_expires, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public.notification (id, "userId", message, "isRead", "createdAt", route) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public.roles (id, "roleName", abbreviation, power, description, permissions, "isActive", created_at, updated_at) FROM stdin;
1	Super Administrator	SA	Admin	Has all permissions	["*"]	t	2026-01-20 13:38:08.131+05:30	2026-01-20 13:38:08.131+05:30
5	Team Lead	TL	SalesExecutive	\N	[]	t	2026-01-20 14:43:51.876+05:30	2026-01-20 14:43:51.876+05:30
7	Sales Associate	SE	SalesExecutive	\N	[]	t	2026-01-20 14:44:24.705+05:30	2026-01-20 14:44:24.705+05:30
\.


--
-- Data for Name: user_approvals; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public.user_approvals (id, user_id, approval_token, token_expires, requested_at, requested_by, approved_by, approved_at, status, approval_notes, rejection_reason, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public.users (id, email, password, name, "empNo", "roleId", "isActive", status, "approvedBy", "approvedAt", "lastLogin", "failedLoginAttempts", "passwordChangedAt", "resetPasswordToken", "resetPasswordExpires", "createdAt", "updatedAt") FROM stdin;
3	sa2@sa2.com	$2a$10$ok.coUZ.kbxEGIgAboajlumQhF6FJ3pANjZ/CHRk1GrqNgmx.5Uvu	SA	SA003	7	t	approved	\N	\N	2026-01-20 16:08:40.457+05:30	0	2026-01-20 14:45:39.438+05:30	\N	\N	2026-01-20 14:45:39.438+05:30	2026-01-20 16:08:40.459+05:30
2	sales@sales.com	$2a$10$aAGV6Aocm0s4d/R/IrWRGuWCZtIssVdf8FQG2TLZLiZMaSiXELwcy	Sales	SA002	5	t	approved	\N	\N	2026-01-20 16:13:17.48+05:30	0	2026-01-20 14:45:06.282+05:30	\N	\N	2026-01-20 14:45:06.282+05:30	2026-01-20 16:13:17.48+05:30
4	saurav2002skumar@gmail.com	$2a$10$kYcy07hleHhJZmJ0jrlfk.Ghutd9ZafgM.bKz4N5RR3WzR6fAXu6m	Saurav S Kumar	60	1	t	approved	\N	\N	\N	0	2026-01-23 10:24:19.782+05:30	\N	\N	2026-01-23 10:24:19.787+05:30	2026-01-23 10:24:19.787+05:30
5	1222@gmail.com	$2a$10$NQuT6ap7xfan0F4FfjR2zONhSpqJrsgrTmSgDfCuYtyFOBDVaXUua	Saurav S Kumar	61	1	t	approved	\N	\N	\N	0	2026-01-23 10:25:35.439+05:30	\N	\N	2026-01-23 10:25:35.442+05:30	2026-01-23 10:25:35.442+05:30
6	superadmin@123.com	SuperAdmin@123	SuperAdmin	SA000	1	f	pending_approval	\N	\N	\N	5	\N	\N	\N	2026-01-23 13:33:25.54+05:30	2026-01-23 17:12:41.791+05:30
1	superadmin@leedsaerospace.com	$2a$10$2QoiFRDSheMgdKO38xc6IO3q5kC0nCUe6bX5PgkYHfpdLZw.Nll4y	System Super Administrator	SA001	1	t	approved	\N	\N	2026-02-03 11:35:48.767+05:30	0	\N	\N	\N	2026-01-20 13:38:08.22+05:30	2026-02-03 11:35:48.77+05:30
\.


--
-- Name: TeamLeader_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."TeamLeader_id_seq"', 2, true);


--
-- Name: TeamMember_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."TeamMember_id_seq"', 4, true);


--
-- Name: Team_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."Team_id_seq"', 1, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."Users_id_seq"', 1, false);


--
-- Name: notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public.notification_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public.roles_id_seq', 7, true);


--
-- Name: user_approvals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public.user_approvals_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


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
-- Name: Users Users_emp_no_key; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_emp_no_key" UNIQUE (emp_no);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- Name: roles roles_abbreviation_key; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_abbreviation_key UNIQUE (abbreviation);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: roles roles_roleName_key; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "roles_roleName_key" UNIQUE ("roleName");


--
-- Name: user_approvals user_approvals_approval_token_key; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.user_approvals
    ADD CONSTRAINT user_approvals_approval_token_key UNIQUE (approval_token);


--
-- Name: user_approvals user_approvals_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.user_approvals
    ADD CONSTRAINT user_approvals_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: TeamLeader TeamLeader_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."TeamLeader"
    ADD CONSTRAINT "TeamLeader_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeamLeader TeamLeader_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."TeamLeader"
    ADD CONSTRAINT "TeamLeader_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeamMember TeamMember_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."TeamMember"
    ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeamMember TeamMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."TeamMember"
    ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notification notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE;


--
-- PostgreSQL database dump complete
--

