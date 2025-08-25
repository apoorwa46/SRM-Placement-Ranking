// src/App.jsx
import { useState } from "react";
import "./index.css";
import Confetti from "react-confetti";
import jsPDF from "jspdf";


export default function App() {
  const [marks, setMarks] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const calculateScore = (e) => {
    e.preventDefault();
    let total = 0;

    // ===== ACADEMICS =====
    const tenth = parseFloat(e.target.tenth.value);
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

    const twelfth = parseFloat(e.target.twelfth.value);
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

    const cgpa = parseFloat(e.target.cgpa.value);
    total +=
      cgpa > 9.5 ? 5 : cgpa >= 9.1 ? 4 : cgpa >= 8.6 ? 3 : cgpa >= 7.5 ? 2 : 1;

    // ===== GITHUB =====
    const contrib = parseInt(e.target.githubContrib.value);
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

    const monthly = parseInt(e.target.githubMonthly.value);
    total += monthly >= 2 ? 2 : monthly === 1 ? 1 : 0;

    total += Math.min(parseInt(e.target.githubProjects.value), 2) * 2;
    total += Math.min(parseInt(e.target.githubCollabs.value), 3) * 2;

    // ===== CODING =====
    const badges = parseInt(e.target.badges.value);
    total += badges >= 5 ? 5 : badges;

    const codingQs = parseInt(e.target.codingQs.value);
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

    // ===== INTERNSHIP =====
    const internship = e.target.internship.value;
    if (internship === "iit" || internship === "srm") total += 5;
    else if (internship === "fortune") total += 4;
    else if (internship === "small") total += 3;
    else if (internship === "short") total += 2;
    else if (internship === "paid") total += 1;

    // ===== CERTIFICATIONS =====
    let certScore = 0;
    const selectedCerts = Array.from(e.target.certs)
      .filter((c) => c.checked)
      .map((c) => c.value);

    selectedCerts.forEach((cert) => {
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
          "nptel",
        ].includes(cert)
      )
        certScore += 2;
      else if (cert === "coursera") certScore += 1;
      else if (["c", "c++", "java", "python"].includes(cert)) certScore += 1;
      else if (cert === "udemy") certScore += 0.5;
    });
    total += Math.min(certScore, 10);

    // ===== PROJECTS =====
    const projects = parseInt(e.target.projects.value);
    if (projects === 1) total += 2;
    else if (projects === 2) total += 4;
    else if (projects >= 3) total += 5;

    if (e.target.fsd.value === "yes") total += 5;

    // ===== HACKATHONS =====
    const hackathons = parseInt(e.target.hackathons.value);
    total +=
      hackathons >= 4
        ? 5
        : hackathons === 3
        ? 4
        : hackathons === 2
        ? 3
        : hackathons === 1
        ? 2
        : 0;

    // ===== INHOUSE PROJECTS =====
    total += Math.min(parseInt(e.target.inhouse.value), 2) * 4;

    // ===== MEMBERSHIP =====
    if (e.target.membership.value === "yes") total += 2;

    // ===== CCC RANK =====
    const rank = parseInt(e.target.cccRank.value);
    if (rank <= 20) total += 15;
    else if (rank <= 30) total += 14;
    else if (rank <= 40) total += 13;
    else if (rank <= 50) total += 12;
    else if (rank <= 99) total += 11;
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

    setMarks(total);
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

  // ===== PDF Download =====
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Placement Readiness Score Report", 20, 20);

    // Score
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(`Score: ${marks} / 100`, 20, 40);

    // Trophy / Badge message
    let trophyMsg = "";
    if (marks >= 80) {
      trophyMsg = "Platinum Achiever";
    } else if (marks >= 60) {
      trophyMsg = "Gold Performer";
    } else if (marks >= 40) {
      trophyMsg = "Silver Learner";
    } else {
      trophyMsg = "Bronze Starter";
    }

    doc.setFontSize(16);
    doc.text(trophyMsg, 20, 55);
    doc.text(" Score >= 80 :- Platinum Achiever");
    doc.text(" Score >= 60 :- Gold Performer");
    doc.text(" Score >= 40 :- Silver Learner");
    doc.text(" Score < 40  :- Bronze Starter");

    // Footer
    doc.setFontSize(12);
    doc.text("Generated by Placement Score Calculator", 20, 80);
    doc.text(`© ${new Date()} Apoorwa Kumar`, 20, 90);

    // Save file
    doc.save("Placement_Score_Report.pdf");
  };

  return (
    <>
    <div className="app">
      {submitted && marks >= 80 && <Confetti />}

      {/* Navbar */}
      <nav id="navbar" className="navbar">
        <div className="nav-left">
          <h1 className="logoText">SRM Placement Ranking Calculator</h1>
        </div>

        <input type="checkbox" id="menu-toggle" className="menu-toggle" />
        <label htmlFor="menu-toggle" className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </label>

        <ul className="nav-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#form">Matrix</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>
      <div id="home" className="home-card">
        <h1 className="home-title">Welcome to the Placement Calculator</h1>
        <p className="home">Calculate your placement readiness score based on various parameters.</p>
        <p className="home">Based on the <strong>SRM Placement Ranking metrices</strong>. </p>
        <p className="home">Get started by filling out the form below!</p>
        <p className="home">Best of luck!</p>
      </div>

      <div id="form" className="form-card">
        <h1 className="form-title">Placement Readiness Score</h1>
        <p className="subtitle">
          Fill in your details below to know your placement readiness out of 100
        </p>

        <form onSubmit={calculateScore} className="form-grid">
          {/* Academics */}
          <h2>📘 Academics</h2>
          <input
            type="number"
            name="tenth"
            placeholder="10th Percentage"
            required
          />
          <input
            type="number"
            name="twelfth"
            placeholder="12th Percentage"
            required
          />
          <input
            type="number"
            step="0.01"
            name="cgpa"
            placeholder="CGPA"
            required
          />

          {/* GitHub */}
          <h2>💻 GitHub</h2>
          <input
            type="number"
            name="githubContrib"
            placeholder="Contributions (year)"
          />
          <input
            type="number"
            name="githubMonthly"
            placeholder="Monthly Contributions"
          />
          <input
            type="number"
            name="githubProjects"
            placeholder="Community Projects"
          />
          <input
            type="number"
            name="githubCollabs"
            placeholder="Collaborations"
          />

          {/* Coding */}
          <h2>⚡ Coding</h2>
          <input type="number" name="badges" placeholder="Badges" />
          <input type="number" name="codingQs" placeholder="Problems Solved" />

          {/* Internship */}
          <h2>🏢 Internship</h2>
          <select name="internship">
            <option value="">Select Internship</option>
            <option value="iit">IIT/NIT</option>
            <option value="srm">SRM Placement</option>
            <option value="fortune">Fortune 500</option>
            <option value="small">Small Company</option>
            <option value="short">Short Duration</option>
            <option value="paid">Paid Internship</option>
          </select>

          {/* Certifications */}
          <h2>📜 Certifications</h2>
          <div className="cert-grid">
            <label>
              <input type="checkbox" name="certs" value="nptel" /> NPTEL
            </label>
            <label>
              <input type="checkbox" name="certs" value="coursera" /> Coursera
            </label>
            <label>
              <input type="checkbox" name="certs" value="udemy" /> Udemy
            </label>
            <label>
              <input type="checkbox" name="certs" value="python" /> Python
            </label>
            <label>
              <input type="checkbox" name="certs" value="c" /> C
            </label>
            <label>
              <input type="checkbox" name="certs" value="java" /> Java
            </label>
            <label>
              <input type="checkbox" name="certs" value="cisco" /> Cisco
            </label>
            <label>
              <input type="checkbox" name="certs" value="redhat" /> RedHat
            </label>
          </div>

          {/* Projects */}
          <h2>🛠️ Projects</h2>
          <input
            type="number"
            name="projects"
            placeholder="Major/Minor Projects"
          />
          <select name="fsd">
            <option value="no">Full Stack Project?</option>
            <option value="yes">Yes</option>
          </select>

          <h2>🏆 Hackathons</h2>
          <input type="number" name="hackathons" placeholder="Hackathons Won" />

          <h2>🏫 Inhouse Projects</h2>
          <input type="number" name="inhouse" placeholder="Inhouse Projects" />

          <h2>👥 Membership</h2>
          <select name="membership">
            <option value="no">None</option>
            <option value="yes">Yes</option>
          </select>

          <h2>📊 CCC Rank</h2>
          <input type="number" name="cccRank" placeholder="CCC Rank" required />

          <button type="submit" className="submit-btn">
            ✨ Calculate My Score
          </button>
        </form>

        {submitted && (
          <div className="result-card">
            <h2>Your Score</h2>
            <div className="score-circle">{marks}</div>
            <p className="badge">{badge}</p>
            <button className="submit-btn" onClick={downloadPDF}>
              📥 Download Report
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer id="contact" className="contact">
        <p>
          © {new Date().getFullYear()} Apoorwa Kumar | Placement Score
          Calculator
        </p>
        <ul>
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
    </div>
    </>
  );
}
