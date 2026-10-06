import { useEffect, useState } from "react";
import { ICON } from "../src/data/icons";
import { usePortfolioData } from "../services/usePortfolioData";
import {
	createBlog,
	createProject,
	deleteBlog,
	deleteProject,
	fetchContactMessages,
	updateBlog,
	updateProject,
	verifyAdminKey,
} from "../services/portfolioApi";
import "../src/dashboard.css";

const NAV_ITEMS = [
	["overview", "Overview"],
	["profile", "Profile"],
	["experience", "Experience"],
	["projects", "Projects"],
	["blogs", "Blogs"],
	["messages", "Messages"],
];

const blankProject = () => ({
	title: "",
	description: "",
	image: "",
	technologies: "",
	tags: "",
	github: "",
	live: "",
	cat: "",
	date: new Date().toISOString().slice(0, 10),
	featured: false,
});

const blankBlog = () => ({
	title: "",
	excerpt: "",
	content: "",
	tags: "",
	mins: 5,
	date: new Date().toISOString().slice(0, 10),
});

function Dashboard() {
	const {
		profile,
		skills,
		experience,
		projects,
		blogs,
		refreshProjects,
		refreshBlogs,
		saveContent,
	} = usePortfolioData();
	const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem("portfolio-admin-key") || "");
	const [authenticated, setAuthenticated] = useState(false);
	const [keyInput, setKeyInput] = useState("");
	const [keyBusy, setKeyBusy] = useState(false);
	const [activeSection, setActiveSection] = useState("overview");
	const [notice, setNotice] = useState("");
	const [busy, setBusy] = useState(false);
	const [profileEdit, setProfileEdit] = useState(null);
	const [skillsEdit, setSkillsEdit] = useState(null);
	const [experienceEdit, setExperienceEdit] = useState(null);
	const [projectDraft, setProjectDraft] = useState(blankProject);
	const [blogDraft, setBlogDraft] = useState(blankBlog);
	const [editingProject, setEditingProject] = useState("");
	const [editingBlog, setEditingBlog] = useState("");
	const [messages, setMessages] = useState([]);

	const profileDraft = profileEdit ?? profile;
	const skillsDraft = skillsEdit ?? skills;
	const experienceDraft = experienceEdit ?? experience;

	useEffect(() => {
		if (!adminKey) return undefined;

		let active = true;
		verifyAdminKey(adminKey)
			.then(() => {
				if (active) setAuthenticated(true);
			})
			.catch(() => {
				sessionStorage.removeItem("portfolio-admin-key");
				if (active) {
					setAdminKey("");
					setAuthenticated(false);
					setNotice("Your admin key was rejected. Enter it again to continue.");
				}
			});

		return () => {
			active = false;
		};
	}, [adminKey]);

	useEffect(() => {
		if (!authenticated || activeSection !== "messages") return;

		fetchContactMessages(adminKey)
			.then(setMessages)
			.catch((error) => setNotice(error.message));
	}, [activeSection, adminKey, authenticated]);

	async function signIn(event) {
		event.preventDefault();
		setKeyBusy(true);
		setNotice("");
		try {
			await verifyAdminKey(keyInput.trim());
			sessionStorage.setItem("portfolio-admin-key", keyInput.trim());
			setAdminKey(keyInput.trim());
			setAuthenticated(true);
			setKeyInput("");
			setNotice("Connected to your CMS.");
			await Promise.all([refreshProjects(), refreshBlogs()]);
		} catch (error) {
			setNotice(error.message);
		} finally {
			setKeyBusy(false);
		}
	}

	function signOut() {
		sessionStorage.removeItem("portfolio-admin-key");
		setAdminKey("");
		setAuthenticated(false);
		setActiveSection("overview");
		setNotice("");
	}

	function updateProfile(field, value) {
		setProfileEdit((current) => ({ ...(current ?? profile), [field]: value }));
	}

	function updateListItem(setter, items, index, field, value) {
		setter(items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
	}

	async function submitContent(event) {
		event.preventDefault();
		setBusy(true);
		setNotice("");
		try {
			await saveContent({
				...profileDraft,
				skills: skillsDraft,
				experience: experienceDraft,
			}, adminKey);
			setNotice("Portfolio content saved.");
		} catch (error) {
			setNotice(error.message);
		} finally {
			setBusy(false);
		}
	}

	function startProjectEdit(project) {
		setEditingProject(project._id || project.id);
		setProjectDraft({
			...project,
			technologies: (project.technologies || []).join(", "),
			tags: (project.tags || []).join(", "),
			date: project.date ? new Date(project.date).toISOString().slice(0, 10) : "",
			cat: project.cat || "",
		});
	}

	function startBlogEdit(blog) {
		setEditingBlog(blog._id || blog.id);
		setBlogDraft({
			...blog,
			tags: (blog.tags || []).join(", "),
			date: blog.date ? new Date(blog.date).toISOString().slice(0, 10) : "",
			content: typeof blog.content === "string" ? blog.content : (blog.body || []).join("\n\n"),
		});
	}

	async function submitProject(event) {
		event.preventDefault();
		setBusy(true);
		setNotice("");
		const payload = {
			title: projectDraft.title,
			description: projectDraft.description,
			image: projectDraft.image,
			technologies: projectDraft.technologies.split(",").map((value) => value.trim()).filter(Boolean),
			tags: projectDraft.tags.split(",").map((value) => value.trim()).filter(Boolean),
			github: projectDraft.github,
			live: projectDraft.live,
			cat: projectDraft.cat,
			date: projectDraft.date,
			featured: projectDraft.featured,
		};
		try {
			if (editingProject) await updateProject(editingProject, payload, adminKey);
			else await createProject(payload, adminKey);
			await refreshProjects();
			setProjectDraft(blankProject());
			setEditingProject("");
			setNotice(editingProject ? "Project updated." : "Project published.");
		} catch (error) {
			setNotice(error.message);
		} finally {
			setBusy(false);
		}
	}

	async function removeProject(project) {
		if (!window.confirm(`Delete “${project.title}”?`)) return;
		try {
			await deleteProject(project._id || project.id, adminKey);
			await refreshProjects();
			setNotice("Project deleted.");
		} catch (error) {
			setNotice(error.message);
		}
	}

	async function submitBlog(event) {
		event.preventDefault();
		setBusy(true);
		setNotice("");
		const payload = {
			title: blogDraft.title,
			excerpt: blogDraft.excerpt,
			content: blogDraft.content,
			tags: blogDraft.tags.split(",").map((value) => value.trim()).filter(Boolean),
			mins: Number(blogDraft.mins) || 5,
			date: blogDraft.date,
		};
		try {
			if (editingBlog) await updateBlog(editingBlog, payload, adminKey);
			else await createBlog(payload, adminKey);
			await refreshBlogs();
			setBlogDraft(blankBlog());
			setEditingBlog("");
			setNotice(editingBlog ? "Blog updated." : "Blog published.");
		} catch (error) {
			setNotice(error.message);
		} finally {
			setBusy(false);
		}
	}

	async function removeBlog(blog) {
		if (!window.confirm(`Delete “${blog.title}”?`)) return;
		try {
			await deleteBlog(blog._id || blog.id, adminKey);
			await refreshBlogs();
			setNotice("Blog deleted.");
		} catch (error) {
			setNotice(error.message);
		}
	}

	function renderOverview() {
		return (
			<>
				<div className="dash-page-title">
					<div>
						<span className="dash-kicker">WORKSPACE</span>
						<h1>Good to see you, {profile.name.split(" ")[0]}.</h1>
						<p>Keep your portfolio current from one place.</p>
					</div>
					<a className="dash-visit" href="/" target="_blank" rel="noreferrer">Open portfolio <span aria-hidden="true">↗</span></a>
				</div>
				<div className="dash-metrics">
					<button className="dash-metric" onClick={() => setActiveSection("projects")}>
						<span>PROJECTS</span><strong>{projects.length}</strong><small>Manage work <b>→</b></small>
					</button>
					<button className="dash-metric" onClick={() => setActiveSection("blogs")}>
						<span>ARTICLES</span><strong>{blogs.length}</strong><small>Manage writing <b>→</b></small>
					</button>
					<button className="dash-metric" onClick={() => setActiveSection("experience")}>
						<span>EXPERIENCE</span><strong>{experience.length}</strong><small>Update timeline <b>→</b></small>
					</button>
				</div>
				<section className="dash-panel dash-overview-panel">
					<div className="dash-panel-heading">
						<div><span className="dash-kicker">QUICK ACCESS</span><h2>Continue editing</h2></div>
					</div>
					<div className="dash-shortcuts">
						{NAV_ITEMS.slice(1, 5).map(([key, label]) => (
							<button key={key} onClick={() => setActiveSection(key)}>
								<span className="dash-shortcut-mark">{label.slice(0, 1)}</span>
								<span><strong>{label}</strong><small>{key === "profile" ? "Name, bio and links" : key === "experience" ? "Roles and education" : key === "projects" ? "Published work" : "Articles and notes"}</small></span>
								<b aria-hidden="true">↗</b>
							</button>
						))}
					</div>
				</section>
			</>
		);
	}

	function renderProfile() {
		return (
			<>
				<PageHeading eyebrow="SITE IDENTITY" title="Profile" description="Edit the details visitors see across your portfolio." />
				<form className="dash-panel dash-form" onSubmit={submitContent}>
					<div className="dash-form-section">
						<div className="dash-section-intro"><h2>Introduction</h2><p>Your name, headline, and about copy.</p></div>
						<div className="dash-fields">
							<label>Name<input required value={profileDraft.name || ""} onChange={(event) => updateProfile("name", event.target.value)} /></label>
							<label>Role / headline<input value={profileDraft.role || ""} onChange={(event) => updateProfile("role", event.target.value)} /></label>
							<label>Portrait URL<input type="url" placeholder="https://..." value={profileDraft.avatar || ""} onChange={(event) => updateProfile("avatar", event.target.value)} /></label>
							  <label>Public / contact email<input type="email" value={profileDraft.email || ""} onChange={(event) => updateProfile("email", event.target.value)} /></label>
							<label className="dash-span-two">About<textarea rows="3" value={profileDraft.about || ""} onChange={(event) => updateProfile("about", event.target.value)} /></label>
							<label className="dash-span-two">More about you<textarea rows="3" value={profileDraft.about2 || ""} onChange={(event) => updateProfile("about2", event.target.value)} /></label>
						</div>
					</div>
					<div className="dash-form-section">
						<div className="dash-section-intro"><h2>Social links</h2><p>These appear below the contact form.</p></div>
						{profileDraft.socials?.map((social, index) => (
							<div className="dash-repeat-row dash-social-row" key={`${social.name}-${index}`}>
								<label>Platform<input value={social.name || ""} onChange={(event) => updateListItem((next) => updateProfile("socials", next), profileDraft.socials, index, "name", event.target.value)} /></label>
								<label>Handle<input value={social.handle || ""} onChange={(event) => updateProfile("socials", profileDraft.socials.map((item, itemIndex) => itemIndex === index ? { ...item, handle: event.target.value } : item))} /></label>
								<label>URL<input type="url" value={social.url || ""} onChange={(event) => updateProfile("socials", profileDraft.socials.map((item, itemIndex) => itemIndex === index ? { ...item, url: event.target.value } : item))} /></label>
								<button className="dash-remove" type="button" aria-label={`Remove ${social.name || "social link"}`} onClick={() => updateProfile("socials", profileDraft.socials.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
							</div>
						))}
						<button className="dash-add-inline" type="button" onClick={() => updateProfile("socials", [...(profileDraft.socials || []), { name: "", handle: "", url: "", color: "#5b5bf0", icon: "instagram" }])}>＋ Add social link</button>
					</div>
					<div className="dash-form-section">
						<div className="dash-section-intro"><h2>Skills</h2><p>Keep the skills strip current.</p></div>
						{skillsDraft.map((skill, index) => (
							<div className="dash-repeat-row dash-skill-row" key={`${skill.name}-${index}`}>
								  <label>Skill<input value={skill.name} onChange={(event) => updateListItem(setSkillsEdit, skillsDraft, index, "name", event.target.value)} /></label>
								  <label>Icon<select value={skill.icon || "java"} onChange={(event) => updateListItem(setSkillsEdit, skillsDraft, index, "icon", event.target.value)}>{Object.keys(ICON).filter((key) => key !== "instagram").map((key) => <option key={key} value={key}>{key}</option>)}</select></label>
								  <label>Color<input type="color" value={skill.color || "#5b5bf0"} onChange={(event) => updateListItem(setSkillsEdit, skillsDraft, index, "color", event.target.value)} /></label>
								  <button className="dash-remove" type="button" aria-label={`Remove ${skill.name}`} onClick={() => setSkillsEdit(skillsDraft.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
							</div>
						))}
						<button className="dash-add-inline" type="button" onClick={() => setSkillsEdit([...skillsDraft, { name: "", color: "#5b5bf0", icon: "java" }])}>＋ Add skill</button>
					</div>
					<FormActions busy={busy} label="Save profile" />
				</form>
			</>
		);
	}

	function renderExperience() {
		return (
			<>
				<PageHeading eyebrow="CAREER TIMELINE" title="Experience" description="Add education, roles, and milestones to your homepage." />
				<form className="dash-panel dash-form" onSubmit={submitContent}>
					  <div className="dash-panel-heading"><div><span className="dash-kicker">TIMELINE</span><h2>{experienceDraft.length} entries</h2></div><button className="dash-button dash-button-soft" type="button" onClick={() => setExperienceEdit([...experienceDraft, { period: "", title: "", organization: "", description: "" }])}>＋ Add entry</button></div>
					<div className="dash-experience-list">
						{experienceDraft.map((item, index) => (
							<article className="dash-experience-item" key={`${item.title}-${index}`}>
								<div className="dash-experience-index">{String(index + 1).padStart(2, "0")}</div>
								<div className="dash-fields">
									  <label>Period<input placeholder="2024 - Now" value={item.period} onChange={(event) => updateListItem(setExperienceEdit, experienceDraft, index, "period", event.target.value)} /></label>
									  <label>Role / degree<input required placeholder="B.Tech, Computer Science" value={item.title} onChange={(event) => updateListItem(setExperienceEdit, experienceDraft, index, "title", event.target.value)} /></label>
									  <label>Organization<input value={item.organization} onChange={(event) => updateListItem(setExperienceEdit, experienceDraft, index, "organization", event.target.value)} /></label>
									  <label>Description<input value={item.description} onChange={(event) => updateListItem(setExperienceEdit, experienceDraft, index, "description", event.target.value)} /></label>
								</div>
								<button className="dash-remove" type="button" onClick={() => setExperienceEdit(experienceDraft.filter((_, itemIndex) => itemIndex !== index))}>Remove entry</button>
							</article>
						))}
					</div>
					<FormActions busy={busy} label="Save experience" />
				</form>
			</>
		);
	}

	function renderProjects() {
		return (
			<>
				<PageHeading eyebrow="PORTFOLIO WORK" title="Projects" description="Publish new work or revise the details visitors see." />
				<div className="dash-management-grid">
					<form className="dash-panel dash-form dash-editor" onSubmit={submitProject}>
						<div className="dash-panel-heading"><div><span className="dash-kicker">PROJECT EDITOR</span><h2>{editingProject ? "Edit project" : "New project"}</h2></div>{editingProject && <button className="dash-text-button" type="button" onClick={() => { setEditingProject(""); setProjectDraft(blankProject()); }}>Cancel edit</button>}</div>
						<label>Project title<input required value={projectDraft.title} onChange={(event) => setProjectDraft({ ...projectDraft, title: event.target.value })} /></label>
						<label>Description<textarea required rows="4" value={projectDraft.description || projectDraft.desc || ""} onChange={(event) => setProjectDraft({ ...projectDraft, description: event.target.value })} /></label>
						<label>Image URL<input type="url" placeholder="https://..." value={projectDraft.image || ""} onChange={(event) => setProjectDraft({ ...projectDraft, image: event.target.value })} /></label>
						<label>Technologies<input placeholder="React, Node.js" value={projectDraft.technologies} onChange={(event) => setProjectDraft({ ...projectDraft, technologies: event.target.value })} /></label>
						<label>Tags<input placeholder="Web, Open source" value={projectDraft.tags} onChange={(event) => setProjectDraft({ ...projectDraft, tags: event.target.value })} /></label>
						<div className="dash-fields">
							<label>Category<input value={projectDraft.cat} onChange={(event) => setProjectDraft({ ...projectDraft, cat: event.target.value })} /></label>
							<label>Project date<input type="date" value={projectDraft.date} onChange={(event) => setProjectDraft({ ...projectDraft, date: event.target.value })} /></label>
							<label>GitHub URL<input type="url" value={projectDraft.github} onChange={(event) => setProjectDraft({ ...projectDraft, github: event.target.value })} /></label>
							<label>Live URL<input type="url" value={projectDraft.live} onChange={(event) => setProjectDraft({ ...projectDraft, live: event.target.value })} /></label>
						</div>
						<label className="dash-toggle"><input type="checkbox" checked={Boolean(projectDraft.featured)} onChange={(event) => setProjectDraft({ ...projectDraft, featured: event.target.checked })} /><span>Feature this project</span></label>
						<FormActions busy={busy} label={editingProject ? "Update project" : "Publish project"} />
					</form>
					<section className="dash-panel dash-list-panel">
						<div className="dash-panel-heading"><div><span className="dash-kicker">LIBRARY</span><h2>{projects.length} projects</h2></div></div>
						<div className="dash-record-list">
							{projects.map((project) => (
								<article className="dash-record" key={project._id || project.id || project.title}>
									<div className="dash-record-mark">P</div>
									<div className="dash-record-copy"><strong>{project.title}</strong><span>{project.tags?.slice(0, 3).join(" · ") || "No tags"}</span></div>
									<div className="dash-record-actions"><button type="button" onClick={() => startProjectEdit(project)}>Edit</button><button className="is-danger" type="button" onClick={() => removeProject(project)}>Delete</button></div>
								</article>
							))}
							{!projects.length && <EmptyState title="No projects yet" body="Create your first project with the form." />}
						</div>
					</section>
				</div>
			</>
		);
	}

	function renderBlogs() {
		return (
			<>
				<PageHeading eyebrow="WRITING DESK" title="Blogs" description="Write, edit, and publish articles for your portfolio." />
				<div className="dash-management-grid">
					<form className="dash-panel dash-form dash-editor" onSubmit={submitBlog}>
						<div className="dash-panel-heading"><div><span className="dash-kicker">ARTICLE EDITOR</span><h2>{editingBlog ? "Edit article" : "New article"}</h2></div>{editingBlog && <button className="dash-text-button" type="button" onClick={() => { setEditingBlog(""); setBlogDraft(blankBlog()); }}>Cancel edit</button>}</div>
						<label>Title<input required value={blogDraft.title} onChange={(event) => setBlogDraft({ ...blogDraft, title: event.target.value })} /></label>
						<label>Excerpt<input required value={blogDraft.excerpt} onChange={(event) => setBlogDraft({ ...blogDraft, excerpt: event.target.value })} /></label>
						<label>Article content<textarea required rows="9" value={blogDraft.content} onChange={(event) => setBlogDraft({ ...blogDraft, content: event.target.value })} /></label>
						<label>Tags<input placeholder="Java, Spring" value={blogDraft.tags} onChange={(event) => setBlogDraft({ ...blogDraft, tags: event.target.value })} /></label>
						<div className="dash-fields">
							<label>Publish date<input type="date" value={blogDraft.date} onChange={(event) => setBlogDraft({ ...blogDraft, date: event.target.value })} /></label>
							<label>Reading time (min)<input type="number" min="1" value={blogDraft.mins} onChange={(event) => setBlogDraft({ ...blogDraft, mins: event.target.value })} /></label>
						</div>
						<FormActions busy={busy} label={editingBlog ? "Update article" : "Publish article"} />
					</form>
					<section className="dash-panel dash-list-panel">
						<div className="dash-panel-heading"><div><span className="dash-kicker">LIBRARY</span><h2>{blogs.length} articles</h2></div></div>
						<div className="dash-record-list">
							{blogs.map((blog) => (
								<article className="dash-record" key={blog._id || blog.id || blog.title}>
									<div className="dash-record-mark dash-blog-mark">B</div>
									<div className="dash-record-copy"><strong>{blog.title}</strong><span>{blog.tags?.slice(0, 3).join(" · ") || "No tags"}</span></div>
									<div className="dash-record-actions"><button type="button" onClick={() => startBlogEdit(blog)}>Edit</button><button className="is-danger" type="button" onClick={() => removeBlog(blog)}>Delete</button></div>
								</article>
							))}
							{!blogs.length && <EmptyState title="No articles yet" body="Start with a short post or tutorial." />}
						</div>
					</section>
				</div>
			</>
		);
	}

	function renderMessages() {
		return (
			<>
				<PageHeading eyebrow="INBOX" title="Messages" description="Contact form submissions delivered to your email and stored here." />
				<section className="dash-panel dash-list-panel">
					<div className="dash-panel-heading"><div><span className="dash-kicker">CONTACT INBOX</span><h2>{messages.length} messages</h2></div><button className="dash-button dash-button-soft" type="button" onClick={() => fetchContactMessages(adminKey).then(setMessages).catch((error) => setNotice(error.message))}>Refresh inbox</button></div>
					<div className="dash-message-list">
						{messages.map((message) => (
							<article className="dash-message" key={message._id}>
								<div className="dash-message-meta"><strong>{message.name}</strong><a href={`mailto:${message.email}`}>{message.email}</a><time>{new Date(message.createdAt).toLocaleDateString()}</time></div>
								<p>{message.message}</p>
							</article>
						))}
						{!messages.length && <EmptyState title="Inbox is clear" body="New contact submissions will appear here." />}
					</div>
				</section>
			</>
		);
	}

	const activeLabel = NAV_ITEMS.find(([key]) => key === activeSection)?.[1] || "Overview";

	if (!authenticated) {
		return (
			<main className="dashboard-login">
				<div className="dash-login-panel">
					<a className="dash-back-link" href="/">← Back to portfolio</a>
					<span className="dash-kicker">PORTFOLIO CMS</span>
					<h1>Sign in to edit</h1>
					  <p>Enter the admin key configured in the backend server's .env file.</p>
					<form onSubmit={signIn}>
						<label>Admin key<input autoComplete="current-password" type="password" required value={keyInput} onChange={(event) => setKeyInput(event.target.value)} /></label>
						<button className="dash-button dash-button-primary" disabled={keyBusy}>{keyBusy ? "Checking key..." : "Open dashboard"}</button>
					</form>
					{notice && <p className="dash-notice" role="status">{notice}</p>}
					<small>The key is held only for this browser session.</small>
				</div>
			</main>
		);
	}

	return (
		<div className="dashboard-shell">
			<aside className="dashboard-sidebar">
				<a className="dash-brand" href="/dashboard"><span className="dash-brand-mark">S</span><span>Studio<small>PORTFOLIO CMS</small></span></a>
				<div className="dash-nav-label">WORKSPACE</div>
				<nav className="dash-nav" aria-label="Dashboard sections">
					{NAV_ITEMS.map(([key, label]) => (
						<button className={activeSection === key ? "is-active" : ""} key={key} onClick={() => { setActiveSection(key); setNotice(""); }}>
							<span className="dash-nav-mark">{label.slice(0, 1)}</span>{label}
							{key === "messages" && messages.length > 0 && <span className="dash-nav-count">{messages.length}</span>}
						</button>
					))}
				</nav>
				<div className="dash-sidebar-bottom">
					<a href="/" target="_blank" rel="noreferrer"><span className="dash-nav-mark">↗</span>View portfolio</a>
					<button onClick={signOut}><span className="dash-nav-mark">⇥</span>Sign out</button>
					<div className="dash-account"><span className="dash-account-avatar">{profile.name.slice(0, 1)}</span><span><strong>{profile.name}</strong><small>Administrator</small></span></div>
				</div>
			</aside>
			<main className="dashboard-main">
				<header className="dash-topbar"><div><span>CMS</span><b>/</b><strong>{activeLabel}</strong></div><span className="dash-connection"><i /> Connected</span></header>
				<div className="dash-content">
					{notice && <div className="dash-notice" role="status">{notice}<button type="button" aria-label="Dismiss notice" onClick={() => setNotice("")}>×</button></div>}
					{activeSection === "overview" && renderOverview()}
					{activeSection === "profile" && renderProfile()}
					{activeSection === "experience" && renderExperience()}
					{activeSection === "projects" && renderProjects()}
					{activeSection === "blogs" && renderBlogs()}
					{activeSection === "messages" && renderMessages()}
				</div>
			</main>
		</div>
	);
}

function PageHeading({ eyebrow, title, description }) {
	return <div className="dash-page-title"><div><span className="dash-kicker">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div></div>;
}

function FormActions({ busy, label }) {
	return <div className="dash-form-actions"><span>Changes update the live portfolio.</span><button className="dash-button dash-button-primary" disabled={busy}>{busy ? "Saving..." : label}</button></div>;
}

function EmptyState({ title, body }) {
	return <div className="dash-empty"><span>—</span><strong>{title}</strong><p>{body}</p></div>;
}

export default Dashboard;
