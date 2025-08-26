// src/App.jsx
import React, { useState } from "react";
import "./index.css";
import Confetti from "react-confetti";
import { Analytics } from "@vercel/analytics/react"

export default function App() {
  const [marks, setMarks] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [infoSection, setInfoSection] = useState(null);

  const closeInfo = () => setInfoSection(null);

  const getNum = (form, name) => {
    if (!form[name]) return 0;
    const v = form[name].value;
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const calculateScore = (e) => {
    e.preventDefault();
    const f = e.target;
    let total = 0;

    // ===== Academics =====
    const tenth = Number(f.tenth.value) || 0;
    total +=
      tenth >= 96
        ? 2.5
        : tenth >= 91
        ? 2
        : tenth >= 86
        ? 1.5
        : tenth >= 75
        ? 1
        : 0.5;

    const twelfth = Number(f.twelfth.value) || 0;
    total +=
      twelfth >= 96
        ? 2.5
        : twelfth >= 91
        ? 2
        : twelfth >= 86
        ? 1.5
        : twelfth >= 75
        ? 1
        : 0.5;

    const cgpa = Number(f.cgpa.value) || 0;
    total +=
      cgpa > 9.5 ? 5 : cgpa >= 9.1 ? 4 : cgpa >= 8.6 ? 3 : cgpa >= 7.5 ? 2 : 1;

    // ===== GitHub =====
    const contrib = getNum(f, "githubContrib");
    total +=
      contrib > 20
        ? 5
        : contrib >= 16
        ? 4
        : contrib >= 11
        ? 3
        : contrib >= 6
        ? 2
        : contrib >= 1
        ? 1
        : 0;

    const monthly = getNum(f, "githubMonthly");
    total += monthly >= 2 ? 2 : monthly === 1 ? 1 : 0;

    total += Math.min(getNum(f, "githubProjects"), 2) * 2; // each community project = 2, max 2 considered
    total += Math.min(getNum(f, "githubCollabs"), 3) * 2; // each collaboration = 2, max 3 considered

    // ===== Coding =====
    const badges = getNum(f, "badges");
    total += badges >= 5 ? 5 : badges;

    const codingQs = getNum(f, "codingQs");
    total +=
      codingQs > 20
        ? 5
        : codingQs >= 16
        ? 4
        : codingQs >= 11
        ? 3
        : codingQs >= 6
        ? 2
        : codingQs >= 1
        ? 1
        : 0;

    // ===== Internships (4 slots, take best/most relevant => max 5 marks) =====
    const internships = [
      f.internship1?.value || "",
      f.internship2?.value || "",
      f.internship3?.value || "",
      f.internship4?.value || "",
    ];
    let internshipScore = 0;
    internships.forEach((i) => {
      if (!i) return;
      if (i === "iit" || i === "srm")
        internshipScore = Math.max(internshipScore, 5);
      else if (i === "fortune") internshipScore = Math.max(internshipScore, 4);
      else if (i === "small") internshipScore = Math.max(internshipScore, 3);
      else if (i === "short") internshipScore = Math.max(internshipScore, 2);
      else if (i === "paid") internshipScore = Math.max(internshipScore, 1);
    });
    total += Math.min(internshipScore, 5);

    // ===== Certifications (5 slots, cap 10 marks) =====
    const certs = [
      f.cert1?.value || "",
      f.cert2?.value || "",
      f.cert3?.value || "",
      f.cert4?.value || "",
      f.cert5?.value || "",
    ];
    let certScore = 0;
    certs.forEach((cert) => {
      if (!cert) return;
      if (
        [
          "cisco",
          "ccna",
          "ccnp",
          "mcna",
          "mcnp",
          "matlab",
          "redhat",
          "ibm",
        ].includes(cert)
      )
        certScore += 2;
      else if (cert === "nptel") certScore += 2;
      else if (cert === "coursera") certScore += 1;
      else if (["c", "c++", "java", "python"].includes(cert)) certScore += 1;
      else if (cert === "udemy") certScore += 0.5;
    });
    total += Math.min(certScore, 10);

    // ===== Projects (3 slots, cap 5 marks) =====
    const projects = [
      f.project1?.value || "",
      f.project2?.value || "",
      f.project3?.value || "",
    ];
    let projScore = 0;
    projects.forEach((p) => {
      if (!p) return;
      if (p === "iit") projScore += 5;
      else if (p === "govt") projScore += 4;
      else if (p === "webapp" || p === "mobile") projScore += 3;
      else if (p === "mini") projScore += 2;
    });
    total += Math.min(projScore, 5);

    // ===== Full Stack Dev (single considered) =====
    if (f.fsd?.value === "yes") total += 5;

    // ===== Hackathons (4 slots, cap 10 marks total) =====
    const hacks = [
      f.hack1?.value || "",
      f.hack2?.value || "",
      f.hack3?.value || "",
      f.hack4?.value || "",
    ];
    let hackScore = 0;
    hacks.forEach((h) => {
      if (!h) return;
      if (h === "first") hackScore += 5;
      else if (h === "second") hackScore += 4;
      else if (h === "third") hackScore += 3;
      else if (h === "participated") hackScore += 2;
    });
    total += Math.min(hackScore, 10);

    // ===== Inhouse Projects =====
    const inhouse = getNum(f, "inhouse");
    total += Math.min(inhouse, 2) * 4;

    // ===== Membership =====
    if (f.membership?.value === "yes") total += 2;

    // ===== CCC Rank (exact ranges as PDF, with NA option) =====
    if (f.cccNA.checked) {
      total += 0;
    } else {
      const rank = Number(f.cccRank.value);
      if (rank > 0) {
        if (rank <= 20) total += 15;
        else if (rank <= 30) total += 14;
        else if (rank <= 40) total += 13;
        else if (rank <= 50) total += 12;
        else if (rank <= 75) total += 11;
        else if (rank <= 100) total += 10;
        else if (rank <= 125) total += 9;
        else if (rank <= 150) total += 8;
        else if (rank <= 175) total += 7;
        else if (rank <= 200) total += 6;
        else if (rank <= 225) total += 5;
        else if (rank <= 250) total += 4;
        else if (rank <= 275) total += 3;
        else if (rank <= 300) total += 2;
        else total += 1;
      }
    }

    // Finalize
    const rounded = Math.round((total + Number.EPSILON) * 100) / 100;
    setMarks(rounded);
    setSubmitted(true);
  };

  const badge =
    marks >= 80
      ? "🏆 Platinum Achiever"
      : marks >= 60
      ? "🥇 Gold Performer"
      : marks >= 40
      ? "🥈 Silver Learner"
      : "🥉 Bronze Starter";

  const infoTexts = {
    academics: `10th / 12th %:
96–100 = 2.5
91–95  = 2
86–90  = 1.5
75–85  = 1
Below 75 = 0.5

CGPA:
> 9.5 = 5
9.1 - 9.5 = 4
8.6 - 9.0 = 3
7.5 - 8.5 = 2
Below 7.5 = 1`,
    github: `GitHub:
Contributions (last 1 year): >20=5, 16-20=4, 11-15=3, 6-10=2, 1-5=1, 0=0
Monthly frequency: 2/month = 2, 1/month = 1, 0 = 0
Community Projects: Max 2 considered; each = 2 marks
Collaborations: Max 3 considered; each = 2 marks`,
    coding: `Coding platforms:
Badges / recognitions: >=5 badges = 5 marks (else number of badges)
Medium & difficult questions solved (platforms): >20=5, 16-20=4, 11-15=3, 6-10=2, 1-5=1`,
    internship: `Internships (min duration for full credit = 3 months).
Options (per internship slot):
IIT/NIT = 5
Placed via SRM placement = 5
Fortune 500 company = 4
Small company = 3
Duration < 3 months = 2
Paid internship = 1
(We consider the best/most relevant internship; max 5 marks)`,
    certs: `Certifications (max 5 considered; cap 10 marks total):
CISCO/CCNA/CCNP/MCNA/MCNP/Matlab/RedHat/IBM = 2 marks each
NPTEL = 2 marks
Coursera = 1 mark
Programming certs (C, C++, Java, Python) = 1 mark
Udemy = 0.5 mark`,
    projects: `Projects (max 3 considered; cap 5 marks):
IIT/NIT/DRDO = 5
Other government projects = 4
Mobile/Web apps = 3
Mini projects = 1-2 based on quality`,
    fsd: `Full Stack Developer:
One FSD project (significant) = 5 marks`,
    hackathons: `Hackathons / coding competitions (up to 4 considered; cap 10 marks):
1st prize = 5
2nd prize = 4
3rd prize = 3
Participation = 2`,
    inhouse: `Inhouse projects under faculty (SRM or other): 
Each project = 4 marks; max 2 considered`,
    membership: `Membership:
At least one valid membership in IEEE/ACM/CSI/ISTE etc. (certificate required) = 2 marks`,
    ccc: `CCC Rank:
<=20 = 15
21-30 = 14
31-40 = 13
41-50 = 12
51-75 = 11
76-100 = 10
101-125 = 9
126-150 = 8
151-175 = 7
176-200 = 6
201-225 = 5
226-250 = 4
251-275 = 3
276-300 = 2
>300 = 1`,
  };

  return (
    <div className="app">
      {submitted && marks >= 80 && <Confetti />}

      <nav className="navbar">
        <div className="nav-left">
          <h1 className="logoText">SRM Placement Ranking Calculator</h1>
        </div>
        <ul className="nav-links">
          <li>
            <a href="#form">Form</a>
          </li>
          <li>
            <a href="#result">Result</a>
          </li>
        </ul>
      </nav>

      <main className="main">
        <section id="form" className="form-card">
          <h2 className="form-title">Placement Readiness — Detailed Form</h2>

          <form onSubmit={calculateScore} className="form-grid">
            {/* Academics */}
            <div className="section">
              <div className="section-head">
                <h3>📘 Academics</h3>
                <button
                  type="button"
                  className="info-btn"
                  onClick={() => setInfoSection("academics")}
                >
                  ℹ
                </button>
              </div>
              <div className="row">
                <label>
                  10th Percentage
                  <input
                    type="number"
                    name="tenth"
                    min="0"
                    max="100"
                    placeholder="e.g. 92"
                    required
                  />
                </label>
                <label>
                  12th Percentage
                  <input
                    type="number"
                    name="twelfth"
                    min="0"
                    max="100"
                    placeholder="e.g. 88"
                    required
                  />
                </label>
                <label>
                  CGPA
                  <input
                    type="number"
                    step="0.01"
                    name="cgpa"
                    min="0"
                    max="10"
                    placeholder="e.g. 8.6"
                    required
                  />
                </label>
              </div>
            </div>

            {/* GitHub */}
            <div className="section">
              <div className="section-head">
                <h3>💻 GitHub</h3>
                <button
                  type="button"
                  className="info-btn"
                  onClick={() => setInfoSection("github")}
                >
                  ℹ
                </button>
              </div>
              <div className="row">
                <label>
                  Contributions (last 1 year)
                  <input
                    type="number"
                    name="githubContrib"
                    min="0"
                    placeholder="e.g. 24"
                  />
                </label>
                <label>
                  Monthly contributions (avg)
                  <input
                    type="number"
                    name="githubMonthly"
                    min="0"
                    placeholder="e.g. 3"
                  />
                </label>
              </div>
              <div className="multi-select">
                <label>
                  Community Projects (count)
                  <input
                    type="number"
                    name="githubProjects"
                    min="0"
                    placeholder="Max 2 counted"
                  />
                </label>
                <label>
                  Collaborations (count)
                  <input
                    type="number"
                    name="githubCollabs"
                    min="0"
                    placeholder="Max 3 counted"
                  />
                </label>
              </div>
            </div>

            {/* Coding */}
            <div className="section">
              <div className="section-head">
                <h3>⚡ Coding</h3>
                <button
                  type="button"
                  className="info-btn"
                  onClick={() => setInfoSection("coding")}
                >
                  ℹ
                </button>
              </div>
              <div className="row">
                <label>
                  Badges / Recognitions
                  <input
                    type="number"
                    name="badges"
                    min="0"
                    placeholder="e.g. 5"
                  />
                </label>
                <label>
                  Medium/Difficulty problems solved
                  <input
                    type="number"
                    name="codingQs"
                    min="0"
                    placeholder="e.g. 18"
                  />
                </label>
              </div>
            </div>

            {/* Internships */}
            <div className="section">
              <div className="section-head">
                <h3>🏢 Internships</h3>
                <button
                  type="button"
                  className="info-btn"
                  onClick={() => setInfoSection("internship")}
                >
                  ℹ
                </button>
              </div>
              <div className="multi-select">
                <label>
                  Internship 1
                  <select name="internship1">
                    <option value="">None</option>
                    <option value="iit">IIT / NIT</option>
                    <option value="srm">Placed via SRM placement</option>
                    <option value="fortune">Fortune 500</option>
                    <option value="small">Small Company</option>
                    <option value="short">Duration &lt; 3 months</option>
                    <option value="paid">Paid Internship</option>
                  </select>
                </label>
                <label>
                  Internship 2
                  <select name="internship2">
                    <option value="">None</option>
                    <option value="iit">IIT / NIT</option>
                    <option value="srm">Placed via SRM placement</option>
                    <option value="fortune">Fortune 500</option>
                    <option value="small">Small Company</option>
                    <option value="short">Duration &lt; 3 months</option>
                    <option value="paid">Paid Internship</option>
                  </select>
                </label>
                <label>
                  Internship 3
                  <select name="internship3">
                    <option value="">None</option>
                    <option value="iit">IIT / NIT</option>
                    <option value="srm">Placed via SRM placement</option>
                    <option value="fortune">Fortune 500</option>
                    <option value="small">Small Company</option>
                    <option value="short">Duration &lt; 3 months</option>
                    <option value="paid">Paid Internship</option>
                  </select>
                </label>
                <label>
                  Internship 4
                  <select name="internship4">
                    <option value="">None</option>
                    <option value="iit">IIT / NIT</option>
                    <option value="srm">Placed via SRM placement</option>
                    <option value="fortune">Fortune 500</option>
                    <option value="small">Small Company</option>
                    <option value="short">Duration &lt; 3 months</option>
                    <option value="paid">Paid Internship</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Certifications */}
            <div className="section">
              <div className="section-head">
                <h3>📜 Certifications</h3>
                <button
                  type="button"
                  className="info-btn"
                  onClick={() => setInfoSection("certs")}
                >
                  ℹ
                </button>
              </div>
              <div className="multi-select">
                <label>
                  Cert 1
                  <select name="cert1">
                    <option value="">None</option>
                    <option value="nptel">NPTEL</option>
                    <option value="coursera">Coursera</option>
                    <option value="udemy">Udemy</option>
                    <option value="python">Python</option>
                    <option value="c">C</option>
                    <option value="c++">C++</option>
                    <option value="java">Java</option>
                    <option value="cisco">Cisco</option>
                    <option value="redhat">RedHat</option>
                    <option value="ibm">IBM</option>
                    <option value="matlab">Matlab</option>
                  </select>
                </label>
                <label>
                  Cert 2
                  <select name="cert2">
                    <option value="">None</option>
                    <option value="nptel">NPTEL</option>
                    <option value="coursera">Coursera</option>
                    <option value="udemy">Udemy</option>
                    <option value="python">Python</option>
                    <option value="c">C</option>
                    <option value="c++">C++</option>
                    <option value="java">Java</option>
                    <option value="cisco">Cisco</option>
                    <option value="redhat">RedHat</option>
                    <option value="ibm">IBM</option>
                    <option value="matlab">Matlab</option>
                  </select>
                </label>
                <label>
                  Cert 3
                  <select name="cert3">
                    <option value="">None</option>
                    <option value="nptel">NPTEL</option>
                    <option value="coursera">Coursera</option>
                    <option value="udemy">Udemy</option>
                    <option value="python">Python</option>
                    <option value="c">C</option>
                    <option value="c++">C++</option>
                    <option value="java">Java</option>
                    <option value="cisco">Cisco</option>
                    <option value="redhat">RedHat</option>
                    <option value="ibm">IBM</option>
                    <option value="matlab">Matlab</option>
                  </select>
                </label>
                <label>
                  Cert 4
                  <select name="cert4">
                    <option value="">None</option>
                    <option value="nptel">NPTEL</option>
                    <option value="coursera">Coursera</option>
                    <option value="udemy">Udemy</option>
                    <option value="python">Python</option>
                    <option value="c">C</option>
                    <option value="c++">C++</option>
                    <option value="java">Java</option>
                    <option value="cisco">Cisco</option>
                    <option value="redhat">RedHat</option>
                    <option value="ibm">IBM</option>
                    <option value="matlab">Matlab</option>
                  </select>
                </label>
                <label>
                  Cert 5
                  <select name="cert5">
                    <option value="">None</option>
                    <option value="nptel">NPTEL</option>
                    <option value="coursera">Coursera</option>
                    <option value="udemy">Udemy</option>
                    <option value="python">Python</option>
                    <option value="c">C</option>
                    <option value="c++">C++</option>
                    <option value="java">Java</option>
                    <option value="cisco">Cisco</option>
                    <option value="redhat">RedHat</option>
                    <option value="ibm">IBM</option>
                    <option value="matlab">Matlab</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Projects */}
            <div className="section">
              <div className="section-head">
                <h3>🛠️ Projects</h3>
                <button
                  type="button"
                  className="info-btn"
                  onClick={() => setInfoSection("projects")}
                >
                  ℹ
                </button>
              </div>
              <div className="multi-select">
                <label>
                  Project 1
                  <select name="project1">
                    <option value="">None</option>
                    <option value="iit">IIT/NIT/DRDO</option>
                    <option value="govt">Other Government</option>
                    <option value="webapp">Web Application</option>
                    <option value="mobile">Mobile Application</option>
                    <option value="mini">Mini Project</option>
                  </select>
                </label>
                <label>
                  Project 2
                  <select name="project2">
                    <option value="">None</option>
                    <option value="iit">IIT/NIT/DRDO</option>
                    <option value="govt">Other Government</option>
                    <option value="webapp">Web Application</option>
                    <option value="mobile">Mobile Application</option>
                    <option value="mini">Mini Project</option>
                  </select>
                </label>
                <label>
                  Project 3
                  <select name="project3">
                    <option value="">None</option>
                    <option value="iit">IIT/NIT/DRDO</option>
                    <option value="govt">Other Government</option>
                    <option value="webapp">Web Application</option>
                    <option value="mobile">Mobile Application</option>
                    <option value="mini">Mini Project</option>
                  </select>
                </label>
              </div>

              <div className="row single">
                <label>
                  Full Stack Developer project?
                  <select name="fsd">
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Hackathons */}
            <div className="section">
              <div className="section-head">
                <h3>🏆 Hackathons</h3>
                <button
                  type="button"
                  className="info-btn"
                  onClick={() => setInfoSection("hackathons")}
                >
                  ℹ
                </button>
              </div>
              <div className="multi-select">
                <label>
                  Hackathon 1
                  <select name="hack1">
                    <option value="">None</option>
                    <option value="first">1st Prize</option>
                    <option value="second">2nd Prize</option>
                    <option value="third">3rd Prize</option>
                    <option value="participated">Participation</option>
                  </select>
                </label>
                <label>
                  Hackathon 2
                  <select name="hack2">
                    <option value="">None</option>
                    <option value="first">1st Prize</option>
                    <option value="second">2nd Prize</option>
                    <option value="third">3rd Prize</option>
                    <option value="participated">Participation</option>
                  </select>
                </label>
                <label>
                  Hackathon 3
                  <select name="hack3">
                    <option value="">None</option>
                    <option value="first">1st Prize</option>
                    <option value="second">2nd Prize</option>
                    <option value="third">3rd Prize</option>
                    <option value="participated">Participation</option>
                  </select>
                </label>
                <label>
                  Hackathon 4
                  <select name="hack4">
                    <option value="">None</option>
                    <option value="first">1st Prize</option>
                    <option value="second">2nd Prize</option>
                    <option value="third">3rd Prize</option>
                    <option value="participated">Participation</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Inhouse, Membership, CCC */}
            <div className="section">
              <div className="section-head">
                <h3>🏫 Inhouse / Membership / CCC</h3>
              </div>
              <div className="row">
                <label>
                  Inhouse Projects (count)
                  <input
                    type="number"
                    name="inhouse"
                    min="0"
                    placeholder="Max 2 counted"
                  />
                </label>

                <label>
                  Professional Membership
                  <select name="membership">
                    <option value="no">None</option>
                    <option value="yes">Yes (IEEE/ACM/CSI/ISTE etc.)</option>
                  </select>
                </label>

                <label>
                  CCC Rank
                  <div className="ccc-wrapper">
                    <input
                      type="number"
                      name="cccRank"
                      min="1"
                      placeholder="e.g. 45"
                    />
                    <label className="ccc-na">
                      <input type="checkbox" name="cccNA" /> Not Applicable
                    </label>
                  </div>
                </label>
              </div>
            </div>

            <div className="submit-row">
              <button type="submit" className="submit-btn">
                ✨ Calculate My Score
              </button>
            </div>
          </form>
        </section>

        <section id="result" className="result-area">
          {submitted && (
            <div className="result-card">
              <h3>Your Score</h3>
              <div className="score-circle">{marks}</div>
              <p className="badge">{badge}</p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer id="contact" className="footer">
          <p>
            © {new Date().getFullYear()} Apoorwa Kumar | Placement Score
            Calculator
          </p>
          <ul className="footer-links">
            <li>
              <a
                href="https://github.com/apoorwa46"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/apoorwa-kumar-479461302/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/apoorwa466/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://my-portfolio-website-seven-lemon.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Portfolio
              </a>
            </li>
          </ul>
        </footer>
      </main>

      {infoSection && (
        <div className="info-modal" onClick={closeInfo}>
          <div className="info-content" onClick={(ev) => ev.stopPropagation()}>
            <h3>Scoring Rules</h3>
            <pre>{infoTexts[infoSection]}</pre>
            <div style={{ textAlign: "right" }}>
              <button onClick={closeInfo} className="close-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Analytics/>
    </div>
  );
}
