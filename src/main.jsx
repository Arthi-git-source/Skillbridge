import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";

import "./index.css";
import { api } from "./api";

/* =========================================================
   DEMO DATA
   ========================================================= */

const demoStudents = [
  {
    id: 1,
    name: "Test Student",
    role: "Data Analyst Student",
    city: "Chennai",
    skills: ["Python", "SQL", "Excel", "Power BI"],
    rating: 4.8,
    completed_tasks: 5,
    color: "from-indigo-500 to-violet-500",
  },
  {
    id: 2,
    name: "Meera Iyer",
    role: "Product Design Student",
    city: "Bangalore",
    skills: ["Figma", "Canva", "UI Design", "Branding"],
    rating: 4.8,
    completed_tasks: 10,
    color: "from-rose-400 to-orange-400",
  },
  {
    id: 3,
    name: "Rohan Patel",
    role: "Web Development Student",
    city: "Mumbai",
    skills: ["React", "CSS", "JavaScript", "WordPress"],
    rating: 4.8,
    completed_tasks: 15,
    color: "from-cyan-500 to-blue-500",
  },
];

const demoTasks = [
  {
    id: "demo-1",
    title: "Build a Sales Dashboard",
    business: "FreshBite Bakery",
    category: "Data & Analytics",
    budget: "₹1,200",
    difficulty: "Intermediate",
    skills: ["Excel", "Power BI"],
    deadline: "2 days",
    description:
      "We have six months of sales data but don't know which products generate the most revenue.",
  },
  {
    id: "demo-2",
    title: "Create a Restaurant Website",
    business: "Spice Route Kitchen",
    category: "Web Development",
    budget: "₹2,500",
    difficulty: "Intermediate",
    skills: ["React", "CSS"],
    deadline: "4 days",
    description:
      "Create a welcoming one-page menu and reservation website.",
  },
  {
    id: "demo-3",
    title: "Clean & Analyze Customer Data",
    business: "Namma Retail",
    category: "Data & Analytics",
    budget: "₹900",
    difficulty: "Beginner",
    skills: ["Python", "Excel"],
    deadline: "1 day",
    description:
      "Organise customer feedback and identify recurring themes.",
  },
];

const categories = [
  "All",
  "Data & Analytics",
  "Web Development",
  "Design",
  "Digital Marketing",
  "Documents",
  "Technology Help",
];

/* =========================================================
   LOCAL STORAGE HELPERS
   ========================================================= */

function getStore(key, defaultValue) {
  try {
    const value = localStorage.getItem(key);

    if (value === null) {
      return defaultValue;
    }

    return JSON.parse(value);
  } catch {
    return defaultValue;
  }
}

function setStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* =========================================================
   SMALL UI COMPONENTS
   ========================================================= */

function Avatar({ person, size = "md" }) {
  const initials = (person?.name || "User")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`grid shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${
        person?.color || "from-violet-500 to-indigo-500"
      } ${
        size === "lg"
          ? "h-20 w-20 text-2xl"
          : "h-11 w-11 text-sm"
      } font-bold text-white`}
    >
      {initials}
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="pill bg-violet/10 text-violet">
      {children}
    </span>
  );
}

function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-2xl">
      <CheckCircle2
        size={18}
        className="text-emerald-300"
      />
      {message}
    </div>
  );
}

function PageHead({ eyebrow, title, copy }) {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-8 pt-12">
      <p className="font-semibold text-violet">
        {eyebrow}
      </p>

      <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">
        {title}
      </h1>

      {copy && (
        <p className="mt-3 max-w-2xl text-slate-600">
          {copy}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   APP
   ========================================================= */

function App() {
  const [route, setRoute] = useState("home");

  const [role, setRole] = useState(
    getStore("sb-role", null)
  );

  const [toast, setToast] = useState("");

  const nav = (nextRoute) => {
    setRoute(nextRoute);
    window.scrollTo(0, 0);
  };

  const notify = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const login = (selectedRole) => {
    setStore("sb-role", selectedRole);
    setRole(selectedRole);

    nav(
      selectedRole === "student"
        ? "student"
        : selectedRole === "business"
        ? "business"
        : "user"
    );

    notify(
      `Demo mode: ${
        selectedRole === "user"
          ? "individual"
          : selectedRole
      } view opened`
    );
  };

  return (
    <>
      <Navbar
        nav={nav}
        role={role}
        setRole={setRole}
      />

      {route === "home" && (
        <Home nav={nav} />
      )}

      {route === "tasks" && (
        <TaskExplorer nav={nav} />
      )}

      {route === "post" && (
        <PostProblem
          nav={nav}
          notify={notify}
        />
      )}

      {route === "student" && (
        <StudentDashboard
          nav={nav}
          notify={notify}
        />
      )}

      {route === "business" && (
        <BusinessDashboard
          nav={nav}
        />
      )}

      {route === "user" && (
        <UserDashboard
          notify={notify}
        />
      )}

      {route === "task" && (
        <TaskDetail
          nav={nav}
          notify={notify}
        />
      )}

      {route === "profile" && (
        <Profile nav={nav} />
      )}

      {route === "matching" && (
        <Matching nav={nav} />
      )}

      {route === "login" && (
        <Login onSelect={login} />
      )}

      <Toast message={toast} />
    </>
  );
}

/* =========================================================
   NAVBAR
   ========================================================= */

function Navbar({
  nav,
  role,
  setRole,
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">

        <button
          onClick={() => nav("home")}
          className="flex items-center gap-2 font-bold text-ink"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet text-white">
            <HeartHandshake size={20} />
          </span>

          <span>SkillBridge</span>
        </button>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
          <button onClick={() => nav("home")}>
            How It Works
          </button>

          <button onClick={() => nav("tasks")}>
            Find Tasks
          </button>

          <button onClick={() => nav("matching")}>
            Find Talent
          </button>

          <button onClick={() => nav("business")}>
            For Businesses
          </button>

          <button onClick={() => nav("student")}>
            For Students
          </button>
        </nav>

        <div className="hidden items-center gap-3 sm:flex">

          {role && (
            <span className="pill bg-emerald-50 text-emerald-700">
              ● Demo Mode
            </span>
          )}

          <button
            className="btn-secondary"
            onClick={() => nav("post")}
          >
            Post a Problem
          </button>

          <button
            className="btn-primary"
            onClick={() =>
              nav(
                role === "student"
                  ? "student"
                  : "login"
              )
            }
          >
            Find Opportunities
          </button>

        </div>

        <button
          className="sm:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>

      </div>

      {open && (
        <div className="border-t bg-white px-5 py-4 sm:hidden">
          <div className="grid gap-2 text-left">

            {[
              ["Find Tasks", "tasks"],
              ["Post a Problem", "post"],
              ["Student Dashboard", "student"],
              ["Business Dashboard", "business"],
              ["Sign in demo", "login"],
            ].map(([label, routeName]) => (
              <button
                key={routeName}
                onClick={() => {
                  nav(routeName);
                  setOpen(false);
                }}
                className="rounded-lg px-3 py-2 text-left hover:bg-slate-50"
              >
                {label}
              </button>
            ))}

          </div>
        </div>
      )}
    </header>
  );
}

/* =========================================================
   HOME
   ========================================================= */

function Home({ nav }) {
  return (
    <main>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_80%_0%,#e5e1ff,transparent_27%),linear-gradient(180deg,#fff,#f8f8ff)]">

        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-20 lg:grid-cols-[1.1fr_.9fr] lg:pt-28">

          <div>

            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet/15 bg-violet/5 px-3 py-1.5 text-sm font-semibold text-violet">
              <Sparkles size={15} />
              Real work. Real growth.
            </p>

            <h1 className="max-w-3xl text-5xl font-bold tracking-[-.055em] text-ink sm:text-6xl">
              Your skills can solve{" "}
              <span className="text-violet">
                real problems.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              SkillBridge connects people and small
              businesses with skilled students who are
              ready to solve real-world tasks.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <button
                onClick={() => nav("post")}
                className="btn-primary px-5 py-3"
              >
                Post a Problem
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => nav("tasks")}
                className="btn-secondary px-5 py-3"
              >
                Explore Opportunities
              </button>

            </div>

            <div className="mt-10 flex gap-7 text-sm">
              <span>
                <b className="block text-2xl text-ink">
                  1,200+
                </b>
                student skills
              </span>

              <span>
                <b className="block text-2xl text-ink">
                  ₹18L+
                </b>
                earned by students
              </span>
            </div>

          </div>

          <div className="card relative my-auto overflow-hidden p-6">

            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-mint blur-2xl" />

            <p className="text-sm font-semibold text-slate-500">
              THE SKILLBRIDGE FLOW
            </p>

            <div className="mt-5 space-y-3">

              {[
                [
                  FileText,
                  "Problem",
                  "Need insight from bakery sales data",
                  "bg-orange-100 text-orange-600",
                ],
                [
                  Sparkles,
                  "AI Match",
                  "Excel · SQL · Power BI",
                  "bg-violet/10 text-violet",
                ],
                [
                  Users,
                  "Student",
                  "Test Student · 100% match",
                  "bg-sky-100 text-sky-600",
                ],
                [
                  CheckCircle2,
                  "Solution",
                  "Clear dashboard + recommendations",
                  "bg-emerald-100 text-emerald-600",
                ],
              ].map(
                ([Icon, title, sub, style]) => (
                  <div
                    key={title}
                    className="flex items-center gap-4"
                  >

                    <span
                      className={`grid h-11 w-11 place-items-center rounded-xl ${style}`}
                    >
                      <Icon size={20} />
                    </span>

                    <div>
                      <b className="text-sm">
                        {title}
                      </b>

                      <p className="text-xs text-slate-500">
                        {sub}
                      </p>
                    </div>

                    {title !== "Solution" && (
                      <ChevronRight className="ml-auto text-slate-300" />
                    )}

                  </div>
                )
              )}

            </div>

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-7xl px-5 py-18">

        <div className="grid gap-5 md:grid-cols-3">

          {[
            [
              HeartHandshake,
              "For Everyone",
              "Get affordable help with everyday problems.",
              "from-orange-50",
            ],
            [
              Zap,
              "For Students",
              "Turn your skills into experience, income and a verified portfolio.",
              "from-violet-50",
            ],
            [
              BriefcaseBusiness,
              "For Businesses",
              "Get skilled support without the cost of a full-time hire.",
              "from-emerald-50",
            ],
          ].map(
            ([Icon, title, description, background]) => (
              <article
                key={title}
                className={`rounded-3xl bg-gradient-to-br ${background} to-white p-7`}
              >

                <Icon className="mb-8 text-violet" />

                <h2 className="text-xl font-bold">
                  {title}
                </h2>

                <p className="mt-2 leading-6 text-slate-600">
                  {description}
                </p>

              </article>
            )
          )}

        </div>

      </section>

      <section
        id="how"
        className="mx-auto max-w-7xl px-5 py-16"
      >

        <div className="max-w-xl">

          <p className="font-semibold text-violet">
            HOW IT WORKS
          </p>

          <h2 className="mt-2 text-4xl font-bold tracking-tight">
            A clearer path from problem to progress.
          </h2>

        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-4">

          {[
            "Describe your problem",
            "Identify required skills",
            "Get matched with students",
            "Collaborate and complete",
          ].map((text, index) => (
            <div
              className="relative"
              key={text}
            >

              <span className="text-5xl font-bold text-violet/20">
                0{index + 1}
              </span>

              <h3 className="mt-3 font-bold">
                {text}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {index === 0
                  ? "Tell us about the problem in your own words."
                  : index === 1
                  ? "The system identifies the skills required."
                  : index === 2
                  ? "Students are matched based on their skills."
                  : "Complete meaningful real-world work."}
              </p>

            </div>
          ))}

        </div>

      </section>

      <Verified />

    </main>
  );
}

function Verified() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">

      <div className="rounded-[2rem] bg-slate-900 px-7 py-12 text-white md:px-12">

        <p className="font-semibold text-emerald-300">
          VERIFIED EXPERIENCE
        </p>

        <div className="mt-3 grid gap-8 lg:grid-cols-2">

          <div>

            <h2 className="text-4xl font-bold tracking-tight">
              Work worth putting on your resume.
            </h2>

            <p className="mt-4 max-w-lg text-slate-300">
              Every completed client project can become
              verified evidence of what a student can do.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-300">
              <span>College Project</span>
              <ArrowRight size={16} />
              <span>Real Client Task</span>
              <ArrowRight size={16} />
              <span className="text-emerald-300">
                Verified Experience
              </span>
              <ArrowRight size={16} />
              <span>Stronger Resume</span>
            </div>

          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-bold text-emerald-300">
                  VERIFIED PROJECT
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  Bakery Sales Dashboard
                </h3>
              </div>

              <ShieldCheck className="text-emerald-300" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">

              <span className="text-slate-400">
                Role
                <b className="block text-white">
                  Data Analyst
                </b>
              </span>

              <span className="text-slate-400">
                Client
                <b className="block text-white">
                  FreshBite Bakery
                </b>
              </span>

              <span className="text-slate-400">
                Skills
                <b className="block text-white">
                  Excel · Power BI
                </b>
              </span>

              <span className="text-slate-400">
                Completion
                <b className="block text-white">
                  September 2026
                </b>
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

/* =========================================================
   FIND TASKS - MYSQL
   ========================================================= */

function TaskExplorer({ nav }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");

  const [tasksFromDB, setTasksFromDB] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.getTasks();

      const dbTasks = (response.data || []).map(
        (task) => ({
          ...task,

          id: task.id,

          title: task.title,

          business:
            task.business ||
            "SkillBridge Business",

          category:
            task.category ||
            "Other",

          budget:
            task.budget !== null &&
            task.budget !== undefined
              ? `₹${Number(
                  task.budget
                ).toLocaleString("en-IN")}`
              : "Budget not specified",

          difficulty:
            task.difficulty ||
            "Intermediate",

          skills: task.required_skills
            ? task.required_skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
            : [],

          deadline: task.deadline
            ? new Date(
                task.deadline
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )
            : "Flexible",

          description:
            task.description || "",
        })
      );

      setTasksFromDB(dbTasks);
    } catch (err) {
      console.error(
        "Failed to load tasks:",
        err
      );

      setError(
        "Could not load tasks from the database."
      );
    } finally {
      setLoading(false);
    }
  };

  const filtered = tasksFromDB.filter(
    (task) => {
      const matchesCategory =
        cat === "All" ||
        task.category === cat;

      const searchableText =
        `${task.title} ${
          task.description
        } ${task.skills.join(" ")}`
          .toLowerCase();

      return (
        matchesCategory &&
        searchableText.includes(
          query.toLowerCase()
        )
      );
    }
  );

  const dbCategories = [
    "All",
    ...new Set(
      tasksFromDB.map(
        (task) => task.category
      )
    ),
  ];

  return (
    <main>

      <PageHead
        eyebrow="OPPORTUNITIES"
        title="Real tasks, ready for your skills."
        copy="Build credible experience one meaningful project at a time."
      />

      <div className="mx-auto max-w-7xl px-5 pb-16">

        <div className="mb-5 flex flex-col gap-3 sm:flex-row">

          <label className="relative flex-1">

            <Search
              className="absolute left-4 top-3.5 text-slate-400"
              size={18}
            />

            <input
              className="input pl-11"
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Search tasks or skills"
            />

          </label>

          <select
            className="input sm:w-56"
            value={cat}
            onChange={(e) =>
              setCat(e.target.value)
            }
          >
            {dbCategories.map(
              (category) => (
                <option key={category}>
                  {category}
                </option>
              )
            )}
          </select>

        </div>

        {loading && (
          <div className="card p-10 text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-violet/20 border-t-violet" />

            <p className="mt-4 font-medium text-slate-600">
              Loading tasks from database...
            </p>

          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">

            <p className="font-semibold">
              {error}
            </p>

            <button
              onClick={loadTasks}
              className="mt-3 font-bold underline"
            >
              Try again
            </button>

          </div>
        )}

        {!loading && !error && (
          <>
            <p className="mb-4 text-sm text-slate-500">
              {filtered.length} opportunities available
            </p>

            {filtered.length === 0 ? (
              <div className="card p-10 text-center">

                <BriefcaseBusiness
                  className="mx-auto text-slate-300"
                  size={42}
                />

                <h2 className="mt-4 text-xl font-bold">
                  No tasks found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Try another search or category.
                </p>

              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                {filtered.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    nav={nav}
                  />
                ))}

              </div>
            )}
          </>
        )}

      </div>

    </main>
  );
}

/* =========================================================
   TASK CARD
   ========================================================= */

function TaskCard({
  task,
  nav,
}) {
  const skills =
    task.skills ||
    task.required_skills
      ?.split(",")
      .map((x) => x.trim()) ||
    [];

  return (
    <article className="card flex flex-col p-5">

      <div className="flex items-start justify-between gap-3">

        <span className="pill bg-slate-100 text-slate-600">
          {task.category}
        </span>

        <span className="font-bold text-violet">
          {task.budget}
        </span>

      </div>

      <h3 className="mt-4 text-lg font-bold">
        {task.title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {task.business ||
          "SkillBridge Business"}
      </p>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
        {task.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1">

        {skills.map((skill) => (
          <Tag key={skill}>
            {skill}
          </Tag>
        ))}

      </div>

      <div className="mt-5 flex items-center justify-between border-t pt-4 text-xs font-medium text-slate-500">

        <span className="flex items-center gap-1">
          <BarChart3 size={14} />
          {task.difficulty ||
            "Intermediate"}
        </span>

        <span className="flex items-center gap-1">
          <Clock3 size={14} />
          {task.deadline ||
            "Flexible"}
        </span>

      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">

        <button
          onClick={() => {
            setStore(
              "sb-current-task-id",
              task.id
            );

            setStore(
              "sb-current-task",
              task
            );

            nav("task");
          }}
          className="btn-secondary text-sm"
        >
          View Task
        </button>

        <button
          onClick={() => {
            setStore(
              "sb-current-task-id",
              task.id
            );

            setStore(
              "sb-current-task",
              task
            );

            nav("task");
          }}
          className="btn-primary text-sm"
        >
          Apply
        </button>

      </div>

    </article>
  );
}

/* =========================================================
   POST A PROBLEM - MYSQL + MATCHING
   ========================================================= */

function PostProblem({
  nav,
  notify,
}) {
  const [form, setForm] = useState({
    type: "Small Business",
    title: "Need a dashboard for my bakery sales",
    description:
      "I own a small bakery and have six months of sales data. I want to know which products sell the most and where my revenue is coming from.",
    category: "Data & Analytics",
    budget: "1200",
    deadline: "2026-10-05",
    skills: "Excel, SQL, Power BI",
  });

  const [step, setStep] = useState(0);

  const [done, setDone] = useState(false);

  const [matches, setMatches] = useState([]);

  const [taskId, setTaskId] = useState(null);

  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      setStep(1);

      const response =
        await api.createTask({
          title: form.title,
          description: form.description,
          category: form.category,
          budget: Number(form.budget),
          deadline: form.deadline,
          required_skills: form.skills,
        });

      const createdTaskId =
        response.id ||
        response.data?.id ||
        response.task?.id;

      if (!createdTaskId) {
        throw new Error(
          "Task was created but no task ID was returned."
        );
      }

      setTaskId(createdTaskId);

      setStore(
        "sb-current-task-id",
        createdTaskId
      );

      setStore(
        "sb-current-task",
        form
      );

      setStep(2);

      const matchResponse =
        await api.getMatches(
          createdTaskId
        );

      setMatches(
        matchResponse.matches ||
          matchResponse.data ||
          []
      );

      setStep(3);

      setTimeout(() => {
        setDone(true);
      }, 400);

    } catch (err) {
      console.error(
        "Create task failed:",
        err
      );

      setError(
        err.message ||
          "Unable to create task."
      );

      setStep(0);
    }
  };

  if (done) {
    return (
      <main>

        <PageHead
          eyebrow="AI MATCH ANALYSIS"
          title="Your problem is understood."
          copy="Your task has been stored in MySQL and suitable students have been identified."
        />

        <div className="mx-auto grid max-w-7xl gap-6 px-5 pb-16 lg:grid-cols-[.9fr_1.1fr]">

          <div className="card p-7">

            <p className="text-sm text-slate-500">
              PROBLEM
            </p>

            <h2 className="mt-1 text-xl font-bold">
              {form.title}
            </h2>

            <div className="mt-7 space-y-5">

              <div>
                <p className="text-xs font-semibold text-slate-500">
                  DETECTED CATEGORY
                </p>

                <b>
                  {form.category}
                </b>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500">
                  REQUIRED SKILLS
                </p>

                <div className="mt-2 flex flex-wrap gap-2">

                  {form.skills
                    .split(",")
                    .map((skill) => (
                      <Tag key={skill}>
                        {skill.trim()}
                      </Tag>
                    ))}

                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <span className="text-sm text-slate-500">
                  Budget

                  <b className="block text-base text-ink">
                    ₹{form.budget}
                  </b>
                </span>

                <span className="text-sm text-slate-500">
                  Task ID

                  <b className="block text-base text-ink">
                    #{taskId}
                  </b>
                </span>

              </div>

              <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 size={18} />
                  Task saved successfully
                </div>

                <p className="mt-1">
                  This task is now available through the database API.
                </p>
              </div>

            </div>

          </div>

          <div>

            <div className="mb-4 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                {matches.length} recommended students
              </h2>

              <button
                onClick={() => nav("matching")}
                className="text-sm font-bold text-violet"
              >
                See smart match{" "}
                <ArrowRight
                  size={15}
                  className="inline"
                />
              </button>

            </div>

            <div className="grid gap-4">

              {matches.length > 0 ? (
                matches.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    nav={nav}
                    notify={notify}
                  />
                ))
              ) : (
                <div className="card p-8 text-center">

                  <Users
                    className="mx-auto text-slate-300"
                    size={40}
                  />

                  <h3 className="mt-3 font-bold">
                    No matching students found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Try adding different required skills.
                  </p>

                </div>
              )}

            </div>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main>

      <PageHead
        eyebrow="POST A PROBLEM"
        title="Tell us what you need."
        copy="Write naturally. SkillBridge translates your problem into the skills that can solve it."
      />

      <div className="mx-auto max-w-3xl px-5 pb-16">

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {step > 0 ? (
          <div className="card p-8">

            <Sparkles
              className="mb-5 animate-pulse text-violet"
              size={32}
            />

            {[
              "Understanding your problem...",
              "Identifying required skills...",
              "Finding suitable matches...",
            ].map((text, index) => (
              <div
                key={text}
                className={`flex items-center gap-3 border-b py-4 ${
                  step > index
                    ? "text-ink"
                    : "text-slate-400"
                }`}
              >

                {step > index ? (
                  <CheckCircle2 className="text-emerald-500" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
                )}

                <span className="font-medium">
                  {text}
                </span>

              </div>
            ))}

          </div>
        ) : (
          <form
            onSubmit={submit}
            className="card p-6 sm:p-8"
          >

            <fieldset>

              <legend className="mb-3 text-sm font-bold">
                Who are you?
              </legend>

              <div className="grid grid-cols-3 gap-2">

                {[
                  "Student",
                  "Small Business",
                  "Individual",
                ].map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() =>
                      setForm({
                        ...form,
                        type,
                      })
                    }
                    className={`rounded-xl border p-3 text-sm font-semibold ${
                      form.type === type
                        ? "border-violet bg-violet/5 text-violet"
                        : "border-slate-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}

              </div>

            </fieldset>

            <div className="mt-6 grid gap-5">

              <label className="text-sm font-semibold">
                Problem title

                <input
                  required
                  className="input mt-2"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                />
              </label>

              <label className="text-sm font-semibold">
                Problem description

                <textarea
                  required
                  rows="4"
                  className="input mt-2"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description:
                        e.target.value,
                    })
                  }
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">

                <label className="text-sm font-semibold">
                  Category

                  <select
                    className="input mt-2"
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category:
                          e.target.value,
                      })
                    }
                  >
                    {categories
                      .slice(1)
                      .map((category) => (
                        <option key={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </label>

                <label className="text-sm font-semibold">
                  Budget (₹)

                  <input
                    type="number"
                    className="input mt-2"
                    value={form.budget}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        budget:
                          e.target.value,
                      })
                    }
                  />
                </label>

                <label className="text-sm font-semibold">
                  Deadline

                  <input
                    type="date"
                    className="input mt-2"
                    value={form.deadline}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        deadline:
                          e.target.value,
                      })
                    }
                  />
                </label>

                <label className="text-sm font-semibold">
                  Required skills

                  <input
                    className="input mt-2"
                    value={form.skills}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        skills:
                          e.target.value,
                      })
                    }
                    placeholder="Excel, SQL, Power BI"
                  />
                </label>

              </div>

              <button
                type="submit"
                className="btn-primary mt-2 w-full py-3"
              >
                Find My Match
                <Sparkles size={18} />
              </button>

            </div>

          </form>
        )}

      </div>

    </main>
  );
}

/* =========================================================
   STUDENT CARD - REAL ASSIGNMENT
   ========================================================= */

function StudentCard({
  student,
  nav,
  notify,
}) {
  const [assigning, setAssigning] =
    useState(false);

  const [assigned, setAssigned] =
    useState(false);

  const match =
    student.match_percentage ??
    student.match ??
    0;

  const completed =
    student.completed_tasks ??
    student.completed ??
    0;

  const assignStudent = async () => {
    try {
      setAssigning(true);

      const taskId = getStore(
        "sb-current-task-id",
        null
      );

      if (!taskId) {
        throw new Error(
          "No task selected. Please create a task first."
        );
      }

      const response =
        await api.createAssignment(
          Number(taskId),
          Number(student.id)
        );

      setAssigned(true);

      if (notify) {
        notify(
          `Student assigned successfully — ${response.match_percentage}% match`
        );
      }

    } catch (error) {
      console.error(
        "Assignment failed:",
        error
      );

      if (notify) {
        notify(error.message);
      } else {
        alert(error.message);
      }

    } finally {
      setAssigning(false);
    }
  };

  return (
    <article className="card p-4">

      <div className="flex items-center gap-4">

        <Avatar person={student} />

        <div className="min-w-0 flex-1">

          <div className="flex justify-between gap-3">

            <div>

              <h3 className="font-bold">
                {student.name}
              </h3>

              <p className="text-sm text-slate-500">
                {student.role || "Student"} ·{" "}
                {student.city || "India"}
              </p>

            </div>

            <b className="text-violet">
              {match}%
            </b>

          </div>

          <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">

            <span className="flex gap-1">
              <Star
                size={13}
                className="fill-amber-400 text-amber-400"
              />
              {student.rating || "N/A"}
            </span>

            <span>
              {completed} completed
            </span>

            <button
              onClick={() => nav("profile")}
              className="ml-auto font-bold text-violet"
            >
              View profile
            </button>

          </div>

        </div>

      </div>

      {student.matching_skills?.length >
        0 && (
        <div className="mt-3 flex flex-wrap gap-1">

          {student.matching_skills.map(
            (skill) => (
              <span
                key={skill}
                className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700"
              >
                ✓ {skill}
              </span>
            )
          )}

        </div>
      )}

      <button
        onClick={assignStudent}
        disabled={
          assigning || assigned
        }
        className={`mt-4 w-full ${
          assigned
            ? "btn-secondary"
            : "btn-primary"
        }`}
      >
        {assigning
          ? "Assigning..."
          : assigned
          ? "✓ Student Assigned"
          : "Assign Student"}
      </button>

    </article>
  );
}

/* =========================================================
   TASK DETAIL - REAL MYSQL TASK
   ========================================================= */

function TaskDetail({
  nav,
  notify,
}) {
  const [task, setTask] =
    useState(
      getStore(
        "sb-current-task",
        null
      )
    );

  const [loading, setLoading] =
    useState(true);

  const [applied, setApplied] =
    useState(false);

  useEffect(() => {
    loadTask();
  }, []);

  const loadTask = async () => {
    try {
      const taskId = getStore(
        "sb-current-task-id",
        null
      );

      if (!taskId) {
        setLoading(false);
        return;
      }

      const response =
        await api.getTask(taskId);

      const actualTask =
        response.data ||
        response.task ||
        response;

      if (actualTask) {
        setTask(actualTask);
        setStore(
          "sb-current-task",
          actualTask
        );
      }

    } catch (error) {
      console.error(
        "Failed to load task:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const apply = async () => {
    try {
      const taskId = getStore(
        "sb-current-task-id",
        null
      );

      if (!taskId) {
        throw new Error(
          "No task selected."
        );
      }

      const studentId = getStore(
        "sb-current-student-id",
        1
      );

      await api.createAssignment(
        Number(taskId),
        Number(studentId)
      );

      setApplied(true);

      notify(
        "Application/assignment saved successfully!"
      );

    } catch (error) {
      console.error(error);

      notify(error.message);
    }
  };

  if (loading) {
    return (
      <main>
        <PageHead
          eyebrow="TASK"
          title="Loading task..."
        />

        <div className="mx-auto max-w-5xl px-5 pb-16">
          <div className="card p-10 text-center">
            Loading from MySQL...
          </div>
        </div>
      </main>
    );
  }

  if (!task) {
    return (
      <main>
        <PageHead
          eyebrow="TASK"
          title="No task selected"
          copy="Please choose a task from Find Tasks."
        />

        <div className="mx-auto max-w-5xl px-5">
          <button
            className="btn-primary"
            onClick={() => nav("tasks")}
          >
            Find Tasks
          </button>
        </div>
      </main>
    );
  }

  const skills =
    task.required_skills
      ?.split(",")
      .map((x) => x.trim())
      .filter(Boolean) ||
    task.skills ||
    [];

  return (
    <main>

      <PageHead
        eyebrow={`${
          task.category ||
          "TASK"
        } · SKILLBRIDGE`}
        title={task.title}
        copy={task.description}
      />

      <div className="mx-auto grid max-w-5xl gap-6 px-5 pb-16 lg:grid-cols-[1fr_.38fr]">

        <article className="card p-7">

          <h2 className="text-xl font-bold">
            The problem
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            {task.description}
          </p>

          <h2 className="mt-8 text-xl font-bold">
            Required skills
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">

            {skills.map((skill) => (
              <Tag key={skill}>
                {skill}
              </Tag>
            ))}

          </div>

          <h2 className="mt-8 text-xl font-bold">
            Database status
          </h2>

          <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 size={18} />
              Task loaded from MySQL
            </div>

            <p className="mt-1">
              Task ID: #{task.id}
            </p>
          </div>

        </article>

        <aside className="card h-fit p-6">

          <p className="text-3xl font-bold text-violet">
            ₹
            {Number(
              task.budget || 0
            ).toLocaleString("en-IN")}
          </p>

          <div className="my-5 space-y-3 border-y py-5 text-sm">

            <p className="flex justify-between">
              Deadline
              <b>
                {task.deadline ||
                  "Flexible"}
              </b>
            </p>

            <p className="flex justify-between">
              Category
              <b>
                {task.category ||
                  "Other"}
              </b>
            </p>

            <p className="flex justify-between">
              Task ID
              <b>#{task.id}</b>
            </p>

          </div>

          <p className="text-xs font-bold text-slate-500">
            REQUIRED SKILLS
          </p>

          <div className="mt-2 flex flex-wrap gap-2">

            {skills.map((skill) => (
              <Tag key={skill}>
                {skill}
              </Tag>
            ))}

          </div>

          <button
            onClick={apply}
            disabled={applied}
            className={`mt-6 w-full ${
              applied
                ? "btn-secondary"
                : "btn-primary"
            }`}
          >
            {applied
              ? "✓ Application Saved"
              : "Apply for Task"}

            {!applied && (
              <ArrowRight size={17} />
            )}
          </button>

        </aside>

      </div>

    </main>
  );
}

/* =========================================================
   MATCHING - REAL MYSQL
   ========================================================= */

function Matching({ nav }) {
  const [loading, setLoading] =
    useState(true);

  const [matches, setMatches] =
    useState([]);

  const [task, setTask] =
    useState(null);

  const loadMatches = async () => {
    try {
      setLoading(true);

      const taskId = getStore(
        "sb-current-task-id",
        null
      );

      if (!taskId) {
        setLoading(false);
        return;
      }

      const response =
        await api.getMatches(
          taskId
        );

      setTask(
        response.task ||
          null
      );

      setMatches(
        response.matches ||
          response.data ||
          []
      );

    } catch (error) {
      console.error(
        "Matching failed:",
        error
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  if (loading) {
    return (
      <main>

        <PageHead
          eyebrow="AI MATCHING"
          title="Finding the right person..."
          copy="Comparing skills stored in the database."
        />

        <div className="mx-auto max-w-5xl px-5 pb-16">

          <div className="card p-9">

            {[
              "Reading the task",
              "Comparing student skills",
              "Calculating matching percentage",
            ].map((text) => (
              <div
                key={text}
                className="flex items-center gap-4 border-b py-5"
              >

                <Sparkles
                  className="animate-pulse text-violet"
                  size={18}
                />

                {text}

              </div>
            ))}

          </div>

        </div>

      </main>
    );
  }

  return (
    <main>

      <PageHead
        eyebrow="SKILL MATCHING"
        title={
          task
            ? `Matches for ${task.title}`
            : "Find the right talent."
        }
        copy="Students are matched based on the skills required by the task."
      />

      <div className="mx-auto max-w-5xl px-5 pb-16">

        {!task ? (
          <div className="card p-10 text-center">

            <Target
              className="mx-auto text-slate-300"
              size={45}
            />

            <h2 className="mt-4 text-xl font-bold">
              No task selected
            </h2>

            <button
              onClick={() => nav("post")}
              className="btn-primary mt-5"
            >
              Create a Task
            </button>

          </div>
        ) : (
          <div className="grid gap-5">

            {matches.length === 0 ? (
              <div className="card p-10 text-center">
                No students match this task yet.
              </div>
            ) : (
              matches.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  nav={nav}
                />
              ))
            )}

          </div>
        )}

      </div>

    </main>
  );
}

/* =========================================================
   STUDENT DASHBOARD
   ========================================================= */

function StudentDashboard({
  nav,
  notify,
}) {
  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [applied, setApplied] =
    useState(
      getStore(
        "sb-applications",
        []
      )
    );

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response =
        await api.getTasks();

      setTasks(
        response.data || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const apply = async (task) => {
    try {
      setStore(
        "sb-current-task-id",
        task.id
      );

      setStore(
        "sb-current-task",
        task
      );

      const studentId = getStore(
        "sb-current-student-id",
        1
      );

      await api.createAssignment(
        Number(task.id),
        Number(studentId)
      );

      if (!applied.includes(task.id)) {
        const updated = [
          ...applied,
          task.id,
        ];

        setApplied(updated);

        setStore(
          "sb-applications",
          updated
        );
      }

      notify(
        "Application saved successfully!"
      );

    } catch (error) {
      console.error(error);

      notify(error.message);
    }
  };

  return (
    <main>

      <PageHead
        eyebrow="STUDENT DASHBOARD"
        title="Good afternoon, Arthi 👋"
        copy="Small steps today become a strong portfolio tomorrow."
      />

      <div className="mx-auto max-w-7xl px-5 pb-16">

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Stat
            icon={BriefcaseBusiness}
            label="Active Applications"
            value={
              3 + applied.length
            }
          />

          <Stat
            icon={CheckCircle2}
            label="Completed Tasks"
            value="7"
            accent="text-emerald-500"
          />

          <Stat
            icon={CircleDollarSign}
            label="Total Earnings"
            value="₹8,450"
            accent="text-amber-500"
          />

          <Stat
            icon={Target}
            label="Skill Score"
            value="82%"
            accent="text-sky-500"
          />

        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_.75fr]">

          <section>

            <div className="mb-4 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Available Tasks
              </h2>

              <button
                onClick={() =>
                  nav("tasks")
                }
                className="text-sm font-bold text-violet"
              >
                View all
              </button>

            </div>

            {loading ? (
              <div className="card p-8">
                Loading tasks...
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">

                {tasks.slice(0, 4).map(
                  (task) => {
                    const skills =
                      task.required_skills
                        ?.split(",")
                        .map((x) =>
                          x.trim()
                        ) || [];

                    return (
                      <article
                        className="card p-5"
                        key={task.id}
                      >

                        <span className="pill bg-violet/10 text-violet">
                          {task.category}
                        </span>

                        <h3 className="mt-4 font-bold">
                          {task.title}
                        </h3>

                        <p className="mt-2 text-lg font-bold text-violet">
                          ₹
                          {Number(
                            task.budget || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-1">

                          {skills.map(
                            (skill) => (
                              <Tag key={skill}>
                                {skill}
                              </Tag>
                            )
                          )}

                        </div>

                        <div className="mt-4 flex gap-2">

                          <button
                            onClick={() => {
                              setStore(
                                "sb-current-task-id",
                                task.id
                              );

                              setStore(
                                "sb-current-task",
                                task
                              );

                              nav("task");
                            }}
                            className="btn-secondary flex-1 text-sm"
                          >
                            View
                          </button>

                          <button
                            onClick={() =>
                              apply(task)
                            }
                            className="btn-primary flex-1 text-sm"
                          >
                            {applied.includes(
                              task.id
                            )
                              ? "Applied"
                              : "Apply"}
                          </button>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

          </section>

          <Career />

        </div>

      </div>

    </main>
  );
}

/* =========================================================
   STAT
   ========================================================= */

function Stat({
  icon: Icon,
  label,
  value,
  accent = "text-violet",
}) {
  return (
    <div className="card p-5">

      <Icon
        className={accent}
        size={22}
      />

      <p className="mt-5 text-2xl font-bold text-ink">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {label}
      </p>

    </div>
  );
}

/* =========================================================
   CAREER
   ========================================================= */

function Career() {
  return (
    <aside className="rounded-3xl bg-gradient-to-br from-violet to-[#3c35b8] p-6 text-white">

      <div className="flex items-center justify-between">

        <p className="font-semibold text-violet-100">
          YOUR CAREER PROFILE
        </p>

        <Target size={20} />

      </div>

      <h3 className="mt-4 text-2xl font-bold">
        Data Analyst
      </h3>

      <p className="mt-1 text-sm text-violet-100">
        SkillBridge gives you real work to prove your skills.
      </p>

      <div className="mt-6">

        <div className="flex justify-between text-sm">
          <span>Skill readiness</span>
          <b>74%</b>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-[74%] rounded-full bg-emerald-300" />
        </div>

      </div>

      <p className="mt-6 text-xs font-bold text-violet-200">
        RECOMMENDED SKILLS
      </p>

      {[
        "SQL",
        "Power BI",
        "Excel",
      ].map((skill) => (
        <div
          className="mt-3 flex items-center justify-between text-sm"
          key={skill}
        >
          {skill}
          <CheckCircle2 size={16} />
        </div>
      ))}

    </aside>
  );
}

/* =========================================================
   PROFILE
   ========================================================= */

function Profile({ nav }) {
  const student =
    demoStudents[0];

  return (
    <main>

      <div className="mx-auto max-w-5xl px-5 py-12">

        <section className="card overflow-hidden">

          <div className="h-28 bg-gradient-to-r from-violet via-indigo-500 to-sky-400" />

          <div className="px-7 pb-7">

            <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end">

              <Avatar
                person={student}
                size="lg"
              />

              <div className="sm:pb-1">

                <h1 className="text-2xl font-bold">

                  {student.name}

                  <ShieldCheck
                    className="ml-1 inline text-emerald-500"
                    size={20}
                  />

                </h1>

                <p className="text-slate-500">
                  {student.role} ·{" "}
                  {student.city}
                </p>

              </div>

              <button
                onClick={() =>
                  nav("matching")
                }
                className="btn-primary sm:ml-auto"
              >
                Hire Student
              </button>

            </div>

            <div className="mt-6 grid grid-cols-3 border-t pt-6 text-center">

              <span>
                <b className="block text-xl">
                  {student.completed_tasks}
                </b>

                <small className="text-slate-500">
                  Completed
                </small>
              </span>

              <span>
                <b className="block text-xl">
                  {student.rating}{" "}
                  <Star
                    className="inline fill-amber-400 text-amber-400"
                    size={15}
                  />
                </b>

                <small className="text-slate-500">
                  Rating
                </small>
              </span>

              <span>
                <b className="block text-xl">
                  ₹14,800
                </b>

                <small className="text-slate-500">
                  Earned
                </small>
              </span>

            </div>

          </div>

        </section>

        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <section className="card p-6">

            <h2 className="font-bold">
              Skills & verification
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">

              {student.skills.map(
                (skill) => (
                  <Tag key={skill}>
                    {skill}
                  </Tag>
                )
              )}

            </div>

            <div className="mt-6 space-y-3">

              {student.skills.map(
                (skill) => (
                  <p
                    className="flex items-center gap-2 text-sm"
                    key={skill}
                  >
                    <CheckCircle2
                      className="text-emerald-500"
                      size={17}
                    />

                    {skill} verified
                  </p>
                )
              )}

            </div>

          </section>

          <section className="card p-6">

            <h2 className="font-bold">
              Verified Work
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Client-backed projects that demonstrate real ability.
            </p>

            {[
              "Sales Dashboard",
              "Customer Data Analysis",
              "Inventory Analysis",
            ].map((project) => (
              <div
                className="mt-4 flex items-center gap-3"
                key={project}
              >

                <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <BarChart3 size={18} />
                </span>

                <div>

                  <b className="text-sm">
                    {project}
                  </b>

                  <p className="text-xs text-slate-500">
                    Verified project
                  </p>

                </div>

              </div>
            ))}

          </section>

        </div>

      </div>

    </main>
  );
}

/* =========================================================
   BUSINESS DASHBOARD
   ========================================================= */

function BusinessDashboard({ nav }) {
  const [tasks, setTasks] =
    useState([]);

  useEffect(() => {
    api.getTasks()
      .then((response) => {
        setTasks(
          response.data || []
        );
      })
      .catch((error) =>
        console.error(error)
      );
  }, []);

  return (
    <main>

      <PageHead
        eyebrow="BUSINESS DASHBOARD"
        title="FreshBite Bakery"
        copy="Keep your business moving without adding a full-time hire."
      />

      <div className="mx-auto max-w-7xl px-5 pb-16">

        <div className="mb-7 flex justify-end">

          <button
            onClick={() =>
              nav("post")
            }
            className="btn-primary"
          >
            <Plus size={18} />
            Post New Problem
          </button>

        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Stat
            icon={FileText}
            label="Open Tasks"
            value={tasks.length}
          />

          <Stat
            icon={Clock3}
            label="Active Projects"
            value="2"
            accent="text-sky-500"
          />

          <Stat
            icon={CheckCircle2}
            label="Completed Projects"
            value="11"
            accent="text-emerald-500"
          />

          <Stat
            icon={CircleDollarSign}
            label="Money Saved"
            value="₹42,000"
            accent="text-amber-500"
          />

        </div>

        <section className="card mt-8 p-6">

          <div className="flex flex-wrap items-start justify-between gap-3">

            <div>

              <p className="text-xs font-bold text-violet">
                DATABASE TASKS
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Recent Posted Tasks
              </h2>

            </div>

            <span className="pill bg-emerald-50 text-emerald-700">
              MySQL Connected
            </span>

          </div>

          <div className="mt-6 grid gap-3">

            {tasks.slice(0, 5).map(
              (task) => (
                <div
                  key={task.id}
                  className="flex flex-col gap-2 rounded-xl border p-4 sm:flex-row sm:items-center"
                >

                  <div className="flex-1">

                    <b>{task.title}</b>

                    <p className="text-sm text-slate-500">
                      {task.category}
                    </p>

                  </div>

                  <span className="text-sm font-bold text-violet">
                    ₹
                    {Number(
                      task.budget || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                  <button
                    onClick={() => {
                      setStore(
                        "sb-current-task-id",
                        task.id
                      );

                      setStore(
                        "sb-current-task",
                        task
                      );

                      nav("task");
                    }}
                    className="btn-secondary text-sm"
                  >
                    View
                  </button>

                </div>
              )
            )}

          </div>

        </section>

      </div>

    </main>
  );
}

/* =========================================================
   USER DASHBOARD
   ========================================================= */

function UserDashboard({
  notify,
}) {
  const [modal, setModal] =
    useState("");

  return (
    <main>

      <PageHead
        eyebrow="MY REQUESTS"
        title="Your practical help, in one place."
      />

      <div className="mx-auto max-w-4xl px-5 pb-16">

        <div className="grid gap-4">

          {[
            {
              title: "Resume redesign",
              status: "Student matched",
              student: "Nisha Singh",
              color:
                "bg-violet/10 text-violet",
            },
            {
              title:
                "Excel expense tracker",
              status: "Completed",
              student: "Priya Menon",
              color:
                "bg-emerald-50 text-emerald-700",
            },
          ].map((request) => (
            <article
              className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center"
              key={request.title}
            >

              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100">
                <FileText className="text-violet" />
              </span>

              <div className="flex-1">

                <h2 className="font-bold">
                  {request.title}
                </h2>

                <p className="text-sm text-slate-500">
                  Matched with{" "}
                  {request.student}
                </p>

              </div>

              <span
                className={`pill ${request.color}`}
              >
                {request.status}
              </span>

              <div className="flex gap-2">

                <button
                  onClick={() =>
                    setModal(
                      "deliverable"
                    )
                  }
                  className="btn-secondary text-sm"
                >
                  View deliverable
                </button>

                <button
                  onClick={() =>
                    setModal("review")
                  }
                  className="btn-primary text-sm"
                >
                  {request.status ===
                  "Completed"
                    ? "Review student"
                    : "Request revision"}
                </button>

              </div>

            </article>
          ))}

        </div>

        {modal && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-5">

            <div className="card w-full max-w-md p-6">

              <button
                onClick={() =>
                  setModal("")
                }
                className="float-right"
              >
                <X />
              </button>

              <h2 className="text-xl font-bold">
                {modal === "review"
                  ? "Leave a review"
                  : "Deliverable preview"}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {modal === "review"
                  ? "Your feedback helps students build a trusted portfolio."
                  : "Your completed file is ready in this demo workspace."}
              </p>

              {modal === "review" && (
                <textarea
                  className="input mt-4"
                  placeholder="Share your experience"
                />
              )}

              <button
                onClick={() => {
                  setModal("");
                  notify(
                    modal === "review"
                      ? "Thank you for your review!"
                      : "Deliverable opened"
                  );
                }}
                className="btn-primary mt-5 w-full"
              >
                Done
              </button>

            </div>

          </div>
        )}

      </div>

    </main>
  );
}

/* =========================================================
   LOGIN
   ========================================================= */

function Login({ onSelect }) {
  return (
    <main className="mx-auto max-w-4xl px-5 py-16 text-center">

      <p className="font-semibold text-violet">
        DEMO MODE
      </p>

      <h1 className="mt-2 text-4xl font-bold">
        Continue as
      </h1>

      <p className="mt-3 text-slate-600">
        Explore each side of SkillBridge.
        No account required.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">

        {[
          [
            Users,
            "Student",
            "Find real tasks, earn and build proof.",
            "student",
          ],
          [
            BriefcaseBusiness,
            "Small Business",
            "Get focused help from emerging talent.",
            "business",
          ],
          [
            HeartHandshake,
            "Individual",
            "Solve everyday problems affordably.",
            "user",
          ],
        ].map(
          ([Icon, title, description, role]) => (
            <button
              onClick={() =>
                onSelect(role)
              }
              className="card p-7 text-left transition hover:-translate-y-1 hover:border-violet"
              key={role}
            >

              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet/10 text-violet">
                <Icon />
              </span>

              <h2 className="mt-6 text-xl font-bold">
                {title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
              </p>

              <span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-violet">
                Continue
                <ArrowRight size={16} />
              </span>

            </button>
          )
        )}

      </div>

    </main>
  );
}

/* =========================================================
   START REACT
   ========================================================= */

createRoot(
  document.getElementById("root")
).render(
  <App />
);