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
-- Name: enum_roles_power; Type: TYPE; Schema: public; Owner: oac_softwares
--

CREATE TYPE public.enum_roles_power AS ENUM (
    'Admin',
    'QualityAdmin',
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
-- Name: Promotions; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public."Promotions" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "oldDesignationId" integer NOT NULL,
    "designationId" integer NOT NULL,
    "previousSalary" numeric(12,2) NOT NULL,
    "newSalary" numeric(12,2) NOT NULL,
    "effectiveDate" date NOT NULL,
    "promotionReason" text,
    "promotionDate" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Promotions" OWNER TO oac_softwares;

--
-- Name: Promotions_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public."Promotions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Promotions_id_seq" OWNER TO oac_softwares;

--
-- Name: Promotions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public."Promotions_id_seq" OWNED BY public."Promotions".id;


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
-- Name: designation; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public.designation (
    id integer NOT NULL,
    "designationName" character varying(255) NOT NULL,
    abbreviation character varying(255) NOT NULL,
    "roleId" integer
);


ALTER TABLE public.designation OWNER TO oac_softwares;

--
-- Name: designation_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public.designation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.designation_id_seq OWNER TO oac_softwares;

--
-- Name: designation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public.designation_id_seq OWNED BY public.designation.id;


--
-- Name: leaveType; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public."leaveType" (
    id integer NOT NULL,
    "leaveTypeName" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."leaveType" OWNER TO oac_softwares;

--
-- Name: leaveType_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public."leaveType_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."leaveType_id_seq" OWNER TO oac_softwares;

--
-- Name: leaveType_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public."leaveType_id_seq" OWNED BY public."leaveType".id;


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
-- Name: role; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public.role (
    id integer NOT NULL,
    "roleName" character varying(255) NOT NULL,
    abbreviation character varying(255) NOT NULL,
    status boolean DEFAULT true,
    department character varying(255)
);


ALTER TABLE public.role OWNER TO oac_softwares;

--
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_id_seq OWNER TO oac_softwares;

--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


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
-- Name: statutoryinfo; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public.statutoryinfo (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "adharNo" character varying(255),
    "panNumber" character varying(255),
    "esiNumber" character varying(255),
    "pfNumber" character varying(255),
    "uanNumber" character varying(255),
    "insuranceNumber" character varying(255),
    "passportNumber" character varying(255),
    "passportExpiry" timestamp with time zone
);


ALTER TABLE public.statutoryinfo OWNER TO oac_softwares;

--
-- Name: statutoryinfo_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public.statutoryinfo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.statutoryinfo_id_seq OWNER TO oac_softwares;

--
-- Name: statutoryinfo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public.statutoryinfo_id_seq OWNED BY public.statutoryinfo.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "empNo" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    "phoneNumber" character varying(255),
    password character varying(255) NOT NULL,
    "roleId" integer NOT NULL,
    status boolean DEFAULT true NOT NULL,
    "userImage" character varying(255),
    url character varying(255),
    director boolean DEFAULT false NOT NULL,
    "paswordReset" boolean DEFAULT false,
    "isTemporary" boolean DEFAULT true NOT NULL,
    separated boolean DEFAULT false,
    "separationNote" text,
    "separationDate" date,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."user" OWNER TO oac_softwares;

--
-- Name: userLeave; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public."userLeave" (
    id integer NOT NULL,
    "userId" integer,
    "leaveTypeId" integer,
    "noOfDays" double precision DEFAULT '0'::double precision,
    "takenLeaves" double precision DEFAULT '0'::double precision,
    "leaveBalance" double precision DEFAULT '0'::double precision,
    year integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."userLeave" OWNER TO oac_softwares;

--
-- Name: userLeave_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public."userLeave_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."userLeave_id_seq" OWNER TO oac_softwares;

--
-- Name: userLeave_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public."userLeave_id_seq" OWNED BY public."userLeave".id;


--
-- Name: userPersonal; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public."userPersonal" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "dateOfJoining" date,
    "confirmationDate" date,
    "bloodGroup" character varying(255),
    "emergencyContactNo" character varying(255),
    "emergencyContactName" character varying(255),
    "emergencyContactRelation" character varying(255),
    "maritalStatus" character varying(255) NOT NULL,
    "dateOfBirth" date,
    gender character varying(255) NOT NULL,
    "parentName" character varying(255),
    "spouseName" character varying(255),
    "referredBy" character varying(255),
    "reportingMangerId" integer,
    "spouseContactNo" character varying(255),
    "parentContactNo" character varying(255),
    "motherName" character varying(255),
    "motherContactNo" character varying(255),
    "temporaryAddress" text,
    "permanentAddress" text,
    qualification character varying(255),
    experience character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."userPersonal" OWNER TO oac_softwares;

--
-- Name: userPersonal_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public."userPersonal_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."userPersonal_id_seq" OWNER TO oac_softwares;

--
-- Name: userPersonal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public."userPersonal_id_seq" OWNED BY public."userPersonal".id;


--
-- Name: userPosition; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public."userPosition" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    division character varying(255),
    "costCentre" character varying(255),
    grade character varying(255),
    location character varying(255),
    department character varying(255),
    office character varying(255),
    salary character varying(255),
    "probationPeriod" integer,
    "probationNote" character varying(255),
    "officialMailId" character varying(255),
    "projectMailId" character varying(255),
    "designationId" integer,
    "teamId" integer,
    "confirmationDate" date
);


ALTER TABLE public."userPosition" OWNER TO oac_softwares;

--
-- Name: userPosition_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public."userPosition_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."userPosition_id_seq" OWNER TO oac_softwares;

--
-- Name: userPosition_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public."userPosition_id_seq" OWNED BY public."userPosition".id;


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
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO oac_softwares;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: useraccount; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public.useraccount (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "bankName" character varying(255) NOT NULL,
    "accountNo" character varying(255) NOT NULL,
    "ifseCode" character varying(255) NOT NULL,
    "paymentFrequency" character varying(255) NOT NULL,
    "modeOfPayment" character varying(255) NOT NULL,
    "branchName" character varying(255)
);


ALTER TABLE public.useraccount OWNER TO oac_softwares;

--
-- Name: useraccount_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public.useraccount_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.useraccount_id_seq OWNER TO oac_softwares;

--
-- Name: useraccount_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public.useraccount_id_seq OWNED BY public.useraccount.id;


--
-- Name: userdocument; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public.userdocument (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "docName" character varying(255) NOT NULL,
    "docUrl" character varying(255)
);


ALTER TABLE public.userdocument OWNER TO oac_softwares;

--
-- Name: userdocument_id_seq; Type: SEQUENCE; Schema: public; Owner: oac_softwares
--

CREATE SEQUENCE public.userdocument_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.userdocument_id_seq OWNER TO oac_softwares;

--
-- Name: userdocument_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oac_softwares
--

ALTER SEQUENCE public.userdocument_id_seq OWNED BY public.userdocument.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: oac_softwares
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    "personalEmail" character varying(255),
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
    "updatedAt" timestamp with time zone NOT NULL,
    "lockoutUntil" timestamp with time zone
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
-- Name: Promotions id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Promotions" ALTER COLUMN id SET DEFAULT nextval('public."Promotions_id_seq"'::regclass);


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
-- Name: designation id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.designation ALTER COLUMN id SET DEFAULT nextval('public.designation_id_seq'::regclass);


--
-- Name: leaveType id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."leaveType" ALTER COLUMN id SET DEFAULT nextval('public."leaveType_id_seq"'::regclass);


--
-- Name: notification id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.notification ALTER COLUMN id SET DEFAULT nextval('public.notification_id_seq'::regclass);


--
-- Name: role id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: statutoryinfo id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.statutoryinfo ALTER COLUMN id SET DEFAULT nextval('public.statutoryinfo_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: userLeave id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."userLeave" ALTER COLUMN id SET DEFAULT nextval('public."userLeave_id_seq"'::regclass);


--
-- Name: userPersonal id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."userPersonal" ALTER COLUMN id SET DEFAULT nextval('public."userPersonal_id_seq"'::regclass);


--
-- Name: userPosition id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."userPosition" ALTER COLUMN id SET DEFAULT nextval('public."userPosition_id_seq"'::regclass);


--
-- Name: user_approvals id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.user_approvals ALTER COLUMN id SET DEFAULT nextval('public.user_approvals_id_seq'::regclass);


--
-- Name: useraccount id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.useraccount ALTER COLUMN id SET DEFAULT nextval('public.useraccount_id_seq'::regclass);


--
-- Name: userdocument id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.userdocument ALTER COLUMN id SET DEFAULT nextval('public.userdocument_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: Promotions; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."Promotions" (id, "userId", "oldDesignationId", "designationId", "previousSalary", "newSalary", "effectiveDate", "promotionReason", "promotionDate", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: Team; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."Team" (id, "teamName", "createdAt", "updatedAt") FROM stdin;
1	AFRICA	2026-07-22 15:46:56.639+05:30	2026-07-22 15:46:56.639+05:30
\.


--
-- Data for Name: TeamLeader; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."TeamLeader" (id, "teamId", "userId", "createdAt", "updatedAt") FROM stdin;
1	1	10	2026-07-22 15:46:56.66+05:30	2026-07-22 15:46:56.66+05:30
\.


--
-- Data for Name: TeamMember; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."TeamMember" (id, "teamId", "userId", "createdAt", "updatedAt") FROM stdin;
1	1	7	2026-07-22 15:46:56.67+05:30	2026-07-22 15:46:56.67+05:30
\.


--
-- Data for Name: designation; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public.designation (id, "designationName", abbreviation, "roleId") FROM stdin;
\.


--
-- Data for Name: leaveType; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."leaveType" (id, "leaveTypeName", "createdAt", "updatedAt") FROM stdin;
1	Casual Leave	2026-04-30 16:38:59.022+05:30	2026-04-30 16:38:59.022+05:30
2	Sick Leave	2026-04-30 16:38:59.022+05:30	2026-04-30 16:38:59.022+05:30
3	LOP	2026-04-30 16:38:59.022+05:30	2026-04-30 16:38:59.022+05:30
4	Comp Off	2026-04-30 16:38:59.022+05:30	2026-04-30 16:38:59.022+05:30
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public.notification (id, "userId", message, "isRead", "createdAt", route) FROM stdin;
1	6	New Payment Request Generated E-007 / po90	t	2026-07-29 16:38:04.737+05:30	\N
2	6	New Payment Request Generated E-008 / p2	t	2026-07-29 17:45:35.841+05:30	\N
3	6	New Payment Request Generated E-009 / 9o	t	2026-07-29 17:50:03.578+05:30	\N
4	6	New Payment Request Generated E-010 / po	t	2026-07-31 13:24:40.963+05:30	\N
5	6	New Payment Request Generated E-011 / po9	t	2026-07-31 13:52:49.864+05:30	\N
6	6	New Payment Request Generated E-012 / PO12	t	2026-07-31 14:42:23.2+05:30	\N
7	6	New Payment Request Generated E-013 / PO12	t	2026-07-31 15:07:37.204+05:30	\N
8	6	New Payment Request Generated E-014 / po1	t	2026-08-07 10:12:58.051+05:30	\N
9	6	New Payment Request Generated E-015 / PO12	t	2026-08-07 14:34:28.359+05:30	\N
14	4	Supplier 'ytuuuu' (LAD/AS/15) is expiring on 19-08-2026.	t	2026-08-18 13:07:09.512+05:30	\N
10	4	Supplier 'ddddddddddddddwws' (LAD/AS/16) is expiring on 20-08-2026.	t	2026-08-18 12:46:14.395+05:30	\N
11	4	Supplier 'ttyyy' (LAD/AS/14) is expiring on 20-08-2026.	t	2026-08-18 12:46:14.42+05:30	\N
20	4	Supplier 'ytuuuu' (LAD/AS/15) is expiring on 19-08-2026.	t	2026-08-18 13:14:39.62+05:30	\N
21	4	Supplier 'ttyyyhjj' (LAD/AS/14) is expiring on 20-08-2026.	t	2026-08-18 13:14:39.648+05:30	\N
22	4	Supplier 'ddddddddddddddwws' (LAD/AS/16) is expiring on 20-08-2026.	t	2026-08-18 13:14:39.667+05:30	\N
23	4	Supplier 'ytuuuu' (LAD/AS/15) is expiring on 19-08-2026.	t	2026-08-18 13:15:19.587+05:30	\N
24	4	Supplier 'ttyyyhjj' (LAD/AS/14) is expiring on 20-08-2026.	t	2026-08-18 13:15:19.611+05:30	\N
25	4	Supplier 'ddddddddddddddwws' (LAD/AS/16) is expiring on 20-08-2026.	t	2026-08-18 13:15:19.632+05:30	\N
26	4	Supplier 'dsfjkkk' (LAD/AS/13) is expiring on 22-08-2026.	t	2026-08-18 13:15:19.657+05:30	\N
27	4	Supplier 'ytuuuu' (LAD/AS/15) is expiring on 19-08-2026.	t	2026-08-18 13:16:19.063+05:30	\N
28	4	Supplier 'ttyyyhjj' (LAD/AS/14) is expiring on 20-08-2026.	t	2026-08-18 13:16:19.082+05:30	\N
29	4	Supplier 'ddddddddddddddwws' (LAD/AS/16) is expiring on 20-08-2026.	t	2026-08-18 13:16:19.099+05:30	\N
30	4	Supplier 'dsfjkkk' (LAD/AS/13) is expiring on 22-08-2026.	t	2026-08-18 13:16:19.12+05:30	\N
31	4	Supplier 'ytuuuu' (LAD/AS/15) is expiring on 19-08-2026.	t	2026-08-18 13:16:59.986+05:30	\N
32	4	Supplier 'ttyyyhjj' (LAD/AS/14) is expiring on 20-08-2026.	t	2026-08-18 13:17:00.005+05:30	\N
33	4	Supplier 'ddddddddddddddwws' (LAD/AS/16) is expiring on 20-08-2026.	t	2026-08-18 13:17:00.031+05:30	\N
34	4	Supplier 'dsfjkkk' (LAD/AS/13) is expiring on 21-08-2026.	t	2026-08-18 13:17:00.051+05:30	\N
35	4	Supplier 'ytuuuu' (LAD/AS/15) is expiring on 19-08-2026.	t	2026-08-18 13:23:47.894+05:30	\N
36	4	Supplier 'ttyyyhjj' (LAD/AS/14) is expiring on 20-08-2026.	t	2026-08-18 13:23:47.919+05:30	\N
37	4	Supplier 'ddddddddddddddwws' (LAD/AS/16) is expiring on 20-08-2026.	t	2026-08-18 13:23:47.948+05:30	\N
38	4	Supplier 'dsfjkkk' (LAD/AS/13) is expiring on 21-08-2026.	t	2026-08-18 13:23:47.978+05:30	\N
39	4	Supplier 'czkl' (LAD/AS/12) is expiring on 20-08-2026.	t	2026-08-18 16:18:04.741+05:30	\N
40	4	Supplier 'ytuuuu' (LAD/AS/15) is expiring on 19-08-2026.	f	2026-08-18 16:52:39.617+05:30	\N
41	4	Supplier 'ttyyyhjj' (LAD/AS/14) is expiring on 20-08-2026.	f	2026-08-18 16:52:39.636+05:30	\N
42	4	Supplier 'hjnmnm' (SUP-26-0002) has expired on 21-04-2026.	f	2026-08-18 16:52:39.653+05:30	\N
43	4	Supplier 'ddddddddddddddwws' (LAD/AS/16) is expiring on 20-08-2026.	f	2026-08-18 16:52:39.678+05:30	\N
44	4	Supplier 'gcfbcxv' (LAD/AS/11) has expired on 17-06-2026.	f	2026-08-18 16:52:39.703+05:30	\N
45	4	Supplier 'yuuuiokkm' (SUP-26-0001) has expired on 30-07-2026.	f	2026-08-18 16:52:39.723+05:30	\N
46	4	Supplier 'sujkkj' (SUP-26-0007) has expired on 18-05-2026.	f	2026-08-18 16:52:39.751+05:30	\N
47	4	Supplier 'dsfjkkk' (LAD/AS/13) is expiring on 21-08-2026.	f	2026-08-18 16:52:39.778+05:30	\N
48	4	Supplier 'czkl' (LAD/AS/12) is expiring on 20-08-2026.	f	2026-08-18 16:52:39.808+05:30	\N
49	4	Supplier 'fgfhfh' (LAD/AS/17) is expiring on 18-08-2027.	f	2026-08-18 17:15:25.911+05:30	\N
50	4	Supplier 'fgfhfh' (LAD/AS/17) is expiring on 20-10-2026.	f	2026-10-12 11:16:18.234+05:30	\N
51	4	Supplier 'fgfhfh' (LAD/AS/17) is expiring on 15-10-2026.	f	2026-10-12 11:16:52.54+05:30	\N
52	4	Supplier 'ytuuuu' (LAD/AS/15) has expired on 19-08-2026.	f	2026-10-14 12:33:42.196+05:30	\N
53	4	Supplier 'ttyyyhjj' (LAD/AS/14) has expired on 20-08-2026.	f	2026-10-14 12:33:42.231+05:30	\N
54	4	Supplier 'hjnmnm' (SUP-26-0002) has expired on 21-04-2026.	f	2026-10-14 12:33:42.257+05:30	\N
55	4	Supplier 'ddddddddddddddwws' (LAD/AS/16) has expired on 20-08-2026.	f	2026-10-14 12:33:42.277+05:30	\N
56	4	Supplier 'gcfbcxv' (LAD/AS/11) has expired on 17-06-2026.	f	2026-10-14 12:33:42.298+05:30	\N
57	4	Supplier 'yuuuiokkm' (SUP-26-0001) has expired on 30-07-2026.	f	2026-10-14 12:33:42.317+05:30	\N
58	4	Supplier 'sujkkj' (SUP-26-0007) has expired on 18-05-2026.	f	2026-10-14 12:33:42.338+05:30	\N
59	4	Supplier 'czkl' (LAD/AS/12) has expired on 20-08-2026.	f	2026-10-14 12:33:42.36+05:30	\N
60	4	Supplier 'dsfjkkk' (LAD/AS/13) has expired on 21-08-2026.	f	2026-10-14 12:33:42.384+05:30	\N
61	4	Supplier 'fgfhfh' (LAD/AS/17) is expiring on 15-10-2026.	f	2026-10-14 12:33:42.408+05:30	\N
62	4	Supplier 'ytuuuu' (LAD/AS/15) has expired on 19-08-2026.	f	2026-10-14 12:35:51.078+05:30	\N
63	4	Supplier 'ttyyyhjj' (LAD/AS/14) has expired on 20-08-2026.	f	2026-10-14 12:35:51.096+05:30	\N
64	4	Supplier 'hjnmnm' (SUP-26-0002) has expired on 21-04-2026.	f	2026-10-14 12:35:51.115+05:30	\N
65	4	Supplier 'ddddddddddddddwws' (LAD/AS/16) has expired on 20-08-2026.	f	2026-10-14 12:35:51.139+05:30	\N
66	4	Supplier 'gcfbcxv' (LAD/AS/11) has expired on 17-06-2026.	f	2026-10-14 12:35:51.163+05:30	\N
67	4	Supplier 'yuuuiokkm' (SUP-26-0001) has expired on 30-07-2026.	f	2026-10-14 12:35:51.187+05:30	\N
68	4	Supplier 'sujkkj' (SUP-26-0007) has expired on 18-05-2026.	f	2026-10-14 12:35:51.211+05:30	\N
69	4	Supplier 'czkl' (LAD/AS/12) has expired on 20-08-2026.	f	2026-10-14 12:35:51.238+05:30	\N
70	4	Supplier 'dsfjkkk' (LAD/AS/13) has expired on 21-08-2026.	f	2026-10-14 12:35:51.275+05:30	\N
71	4	Supplier 'fgfhfh' (LAD/AS/17) is expiring on 15-10-2026.	f	2026-10-14 12:35:51.307+05:30	\N
72	4	Supplier 'ytuuuu' (LAD/AS/15) has expired on 19-08-2026.	f	2026-10-15 00:00:00.132+05:30	\N
73	4	Supplier 'ttyyyhjj' (LAD/AS/14) has expired on 20-08-2026.	f	2026-10-15 00:00:00.163+05:30	\N
74	4	Supplier 'hjnmnm' (SUP-26-0002) has expired on 21-04-2026.	f	2026-10-15 00:00:00.191+05:30	\N
75	4	Supplier 'ddddddddddddddwws' (LAD/AS/16) has expired on 20-08-2026.	f	2026-10-15 00:00:00.217+05:30	\N
76	4	Supplier 'gcfbcxv' (LAD/AS/11) has expired on 17-06-2026.	f	2026-10-15 00:00:00.238+05:30	\N
77	4	Supplier 'yuuuiokkm' (SUP-26-0001) has expired on 30-07-2026.	f	2026-10-15 00:00:00.262+05:30	\N
78	4	Supplier 'sujkkj' (SUP-26-0007) has expired on 18-05-2026.	f	2026-10-15 00:00:00.284+05:30	\N
79	4	Supplier 'czkl' (LAD/AS/12) has expired on 20-08-2026.	f	2026-10-15 00:00:00.305+05:30	\N
80	4	Supplier 'dsfjkkk' (LAD/AS/13) has expired on 21-08-2026.	f	2026-10-15 00:00:00.326+05:30	\N
81	4	Supplier 'fgfhfh' (LAD/AS/17) is expiring on 15-10-2026.	f	2026-10-15 00:00:00.347+05:30	\N
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public.role (id, "roleName", abbreviation, status, department) FROM stdin;
1	Super Administrator	SA	t	\N
2	Quality Super Administrator	QSA	t	\N
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public.roles (id, "roleName", abbreviation, power, description, permissions, "isActive", created_at, updated_at) FROM stdin;
1	Super Administrator	SA	Admin	Has all permissions	["*"]	t	2026-03-09 12:28:07.873+05:30	2026-03-09 12:28:07.873+05:30
3	KEY ACCOUNT MANAGER	KAM	KAM	\N	[]	t	2026-07-22 15:35:13.39+05:30	2026-07-22 15:35:13.39+05:30
4	TEAM LEAD	TL	SalesExecutive	\N	[]	t	2026-07-22 15:38:49.891+05:30	2026-07-22 15:38:49.891+05:30
5	SALES ASSOCIATE	SE	SalesExecutive	\N	[]	t	2026-07-22 15:39:26.746+05:30	2026-07-22 15:39:26.746+05:30
6	OPERATIONS MANAGER	AM	Manager	\N	[]	t	2026-07-22 15:39:58.08+05:30	2026-07-22 15:39:58.08+05:30
7	FINANCE MANAGER	FM	Accountant	\N	[]	t	2026-07-22 15:40:32.602+05:30	2026-07-22 15:40:32.602+05:30
2	Quality Super Administrator	QSA	QualityAdmin	Full access to quality and compliance modules	["QUALITY_ALL", "DOC_APPROVE", "AUDIT_ALL"]	t	2026-03-11 14:17:58.468+05:30	2026-07-22 15:56:56.284+05:30
\.


--
-- Data for Name: statutoryinfo; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public.statutoryinfo (id, "userId", "adharNo", "panNumber", "esiNumber", "pfNumber", "uanNumber", "insuranceNumber", "passportNumber", "passportExpiry") FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."user" (id, name, "empNo", email, "phoneNumber", password, "roleId", status, "userImage", url, director, "paswordReset", "isTemporary", separated, "separationNote", "separationDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: userLeave; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."userLeave" (id, "userId", "leaveTypeId", "noOfDays", "takenLeaves", "leaveBalance", year, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: userPersonal; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."userPersonal" (id, "userId", "dateOfJoining", "confirmationDate", "bloodGroup", "emergencyContactNo", "emergencyContactName", "emergencyContactRelation", "maritalStatus", "dateOfBirth", gender, "parentName", "spouseName", "referredBy", "reportingMangerId", "spouseContactNo", "parentContactNo", "motherName", "motherContactNo", "temporaryAddress", "permanentAddress", qualification, experience, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: userPosition; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public."userPosition" (id, "userId", division, "costCentre", grade, location, department, office, salary, "probationPeriod", "probationNote", "officialMailId", "projectMailId", "designationId", "teamId", "confirmationDate") FROM stdin;
\.


--
-- Data for Name: user_approvals; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public.user_approvals (id, user_id, approval_token, token_expires, requested_at, requested_by, approved_by, approved_at, status, approval_notes, rejection_reason, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: useraccount; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public.useraccount (id, "userId", "bankName", "accountNo", "ifseCode", "paymentFrequency", "modeOfPayment", "branchName") FROM stdin;
\.


--
-- Data for Name: userdocument; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public.userdocument (id, "userId", "docName", "docUrl") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: oac_softwares
--

COPY public.users (id, email, "personalEmail", password, name, "empNo", "roleId", "isActive", status, "approvedBy", "approvedAt", "lastLogin", "failedLoginAttempts", "passwordChangedAt", "resetPasswordToken", "resetPasswordExpires", "createdAt", "updatedAt", "lockoutUntil") FROM stdin;
8	opemdummy@gmail.com	opemdummy@gmail.com	$2b$10$plCEvEmf67gMeL55Cq/Q4edqggWLYEEXeJ3EuE2YvMkuaDiNatyTa	OMempl	EMP003	6	t	approved	\N	\N	\N	0	2026-07-22 15:43:45.381+05:30	\N	\N	2026-07-22 15:43:45.382+05:30	2026-07-22 15:43:45.382+05:30	\N
9	financeemail@gmail.com	financeemail@gmail.com	$2b$10$JiMNh5Y4p9oaWhhUNa29heUke23NlHksINvy6QeDk731I3S3Vba92	Finanaceemployee	EMP004	7	t	approved	\N	\N	\N	0	2026-07-22 15:44:47.09+05:30	\N	\N	2026-07-22 15:44:47.09+05:30	2026-07-22 15:44:47.09+05:30	\N
10	tlemploye@gmail.com	tlemploye@gmail.com	$2b$10$8YK6imzS3MXyVCqiQ5fmpeFnERnJMSjaFoU2X1crotnIploob0JbW	TL employee	EMP005	4	t	approved	\N	\N	\N	0	2026-07-22 15:46:18.199+05:30	\N	\N	2026-07-22 15:46:18.201+05:30	2026-07-22 15:46:18.201+05:30	\N
7	salesexecutivedummy@gmail.com	salesexecutivedummy@gmail.com	$2b$10$m63qSnZopcWK1YeGtCnfZeWp/7EHmQx4GGPoQq13Lj9AvsASLjYgS	Saleseexecutive	EMP002	5	t	approved	\N	\N	2026-08-07 14:48:53.879+05:30	0	2026-07-28 16:40:59.59+05:30	\N	\N	2026-07-22 15:42:02.649+05:30	2026-08-07 14:48:53.879+05:30	\N
3	superadmin@leedsaerospace.com	\N	$2b$10$1LFkT57NF4Q3zIpR.l6AmeWviej7pOd.YLd.SYp5dZZmdYudvQo0K	System Super Administrator	SA001	1	t	approved	\N	\N	2026-08-07 14:49:29.589+05:30	0	\N	\N	\N	2026-03-11 14:23:11.911+05:30	2026-08-07 14:49:29.589+05:30	\N
6	kamtestdummy@gmail.com	kamtestdummy@gmail.com	$2b$10$7X5JCzL0HjEaLB0GpCkNjetNxZu6a3fBP0wi0O/yTmwsHAHqOdRTq	KAM emplyee	EMP001	3	t	approved	\N	\N	2026-08-10 16:26:00.299+05:30	0	2026-07-22 15:36:54.233+05:30	\N	\N	2026-07-22 15:36:54.234+05:30	2026-08-10 16:26:00.299+05:30	\N
5	empa@gmail.com	empa@gmail.com	$2b$10$ft2G0MhJ9C/98Ml2eYjNn.qb404rz/.t83pGFIMEHpaUwUYI0yO/q	empa	EMP01	1	t	approved	\N	\N	\N	0	2026-07-21 17:49:11.994+05:30	\N	\N	2026-07-21 17:49:11.995+05:30	2026-07-21 17:49:11.995+05:30	\N
4	qualityadmin@leedsaerospace.com	\N	$2b$10$fzMLDlD.zQekR3hTyjP4seMnBZQve1uXypGm2PG/x4D3cPnvaOnA.	Quality Super Administrator	QSA001	2	t	approved	\N	\N	2026-10-14 15:16:06.491+05:30	0	\N	\N	\N	2026-03-11 14:23:11.925+05:30	2026-10-14 15:16:06.493+05:30	\N
\.


--
-- Name: Promotions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."Promotions_id_seq"', 1, false);


--
-- Name: TeamLeader_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."TeamLeader_id_seq"', 1, true);


--
-- Name: TeamMember_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."TeamMember_id_seq"', 1, true);


--
-- Name: Team_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."Team_id_seq"', 1, true);


--
-- Name: designation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public.designation_id_seq', 1, false);


--
-- Name: leaveType_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."leaveType_id_seq"', 4, true);


--
-- Name: notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public.notification_id_seq', 81, true);


--
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public.role_id_seq', 2, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public.roles_id_seq', 7, true);


--
-- Name: statutoryinfo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public.statutoryinfo_id_seq', 1, false);


--
-- Name: userLeave_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."userLeave_id_seq"', 1, false);


--
-- Name: userPersonal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."userPersonal_id_seq"', 1, false);


--
-- Name: userPosition_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public."userPosition_id_seq"', 1, false);


--
-- Name: user_approvals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public.user_approvals_id_seq', 1, false);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public.user_id_seq', 1, false);


--
-- Name: useraccount_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public.useraccount_id_seq', 1, false);


--
-- Name: userdocument_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public.userdocument_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oac_softwares
--

SELECT pg_catalog.setval('public.users_id_seq', 10, true);


--
-- Name: Promotions Promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Promotions"
    ADD CONSTRAINT "Promotions_pkey" PRIMARY KEY (id);


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
-- Name: designation designation_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.designation
    ADD CONSTRAINT designation_pkey PRIMARY KEY (id);


--
-- Name: leaveType leaveType_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."leaveType"
    ADD CONSTRAINT "leaveType_pkey" PRIMARY KEY (id);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


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
-- Name: statutoryinfo statutoryinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.statutoryinfo
    ADD CONSTRAINT statutoryinfo_pkey PRIMARY KEY (id);


--
-- Name: userLeave userLeave_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."userLeave"
    ADD CONSTRAINT "userLeave_pkey" PRIMARY KEY (id);


--
-- Name: userPersonal userPersonal_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."userPersonal"
    ADD CONSTRAINT "userPersonal_pkey" PRIMARY KEY (id);


--
-- Name: userPosition userPosition_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."userPosition"
    ADD CONSTRAINT "userPosition_pkey" PRIMARY KEY (id);


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
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: useraccount useraccount_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.useraccount
    ADD CONSTRAINT useraccount_pkey PRIMARY KEY (id);


--
-- Name: userdocument userdocument_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.userdocument
    ADD CONSTRAINT userdocument_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: Promotions Promotions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."Promotions"
    ADD CONSTRAINT "Promotions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: designation designation_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.designation
    ADD CONSTRAINT "designation_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.role(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notification notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: statutoryinfo statutoryinfo_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.statutoryinfo
    ADD CONSTRAINT "statutoryinfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: userLeave userLeave_leaveTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."userLeave"
    ADD CONSTRAINT "userLeave_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES public."leaveType"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: userPersonal userPersonal_reportingMangerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."userPersonal"
    ADD CONSTRAINT "userPersonal_reportingMangerId_fkey" FOREIGN KEY ("reportingMangerId") REFERENCES public."user"(id) ON UPDATE CASCADE;


--
-- Name: userPersonal userPersonal_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."userPersonal"
    ADD CONSTRAINT "userPersonal_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: userPosition userPosition_designationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."userPosition"
    ADD CONSTRAINT "userPosition_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES public.designation(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: userPosition userPosition_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."userPosition"
    ADD CONSTRAINT "userPosition_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user user_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.role(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: useraccount useraccount_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.useraccount
    ADD CONSTRAINT "useraccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: userdocument userdocument_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.userdocument
    ADD CONSTRAINT "userdocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: oac_softwares
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE;


--
-- PostgreSQL database dump complete
--

