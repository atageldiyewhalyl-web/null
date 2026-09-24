import type { QuestionnaireTranslation } from "../types";

/** English text for the Fidelis questionnaire. Option lists follow the German order. */
export const fidelisEn: QuestionnaireTranslation = {
  title: "Fidelis – Meta Campaigns Questionnaire",
  intro: {
    headline: "Meta Campaigns Questionnaire",
    body: [
      "We're starting new Meta campaigns for Fidelis / Pflegedienst Orchidee. These questions settle who you're hiring and which patients we should reach.",
    ],
    duration: "Estimated time: about 5 minutes",
  },
  contact: {
    title: "Who is filling in this questionnaire?",
    help: "So we can reach the right person if anything is unclear.",
    fields: { name: "Your name", role: "Role in the company", email: "Email", phone: "Phone" },
  },
  sections: {
    kampagnen: { title: "Campaigns" },
    recruiting: {
      title: "Hiring",
      intro: {
        title: "Hiring",
        body: ["Now the open position. Your answers decide how we word the ads and which applicants we reach."],
      },
    },
    patienten: {
      title: "Patients",
      intro: {
        title: "Patients & families",
        body: ["Now the patient campaign. We may only promise in the ads what you confirm here."],
      },
    },
    ablauf: {
      title: "Enquiries & budget",
      intro: {
        title: "Enquiries & budget",
        body: ["Finally, who handles new enquiries and which budget we start with."],
      },
    },
  },
  questions: {
    q1: {
      group: "Campaigns",
      label: "Which campaigns should we run?",
      help: "You can pick both.",
      options: ["Hiring staff", "Patients / new clients"],
    },
    q2: {
      label: "Which area should the campaigns cover?",
      options: ["Koblenz + 17 km (as before)", "Koblenz + wider radius", "Mannheim", "Other"],
    },
    q3: {
      group: "The position",
      label: "Which position are you hiring for?",
      options: [
        "Care assistant (no training, career changers)",
        "Care helper (1-year training)",
        "Qualified nurse (3-year training)",
        "Support worker under §43b",
        "Everyday support / housekeeping",
        "Driver for care rounds",
        "Deputy care service manager",
        "Other",
      ],
    },
    q4: {
      label: "What does the job look like?",
      options: [
        "Full-time",
        "Part-time",
        "Mini-job",
        "Shift work",
        "Fixed rounds",
        "Early shift only",
        "Late shift only",
        "Weekend shifts",
        "Company car",
      ],
    },
    q5: {
      label: "What must applicants bring?",
      options: [
        "No experience needed – career changers welcome",
        "Work experience required",
        "Completed training / qualification",
        "Basic care course is enough",
        "Basic German is enough",
        "Good German required",
        "Turkish is an advantage",
        "Driving licence required",
        "No driving licence needed",
      ],
    },
    q6: {
      label: "What should we use to convince applicants?",
      options: [
        "Above-average pay",
        "Name a concrete salary",
        "Bonus payments",
        "Predictable shifts",
        "Preferred shift planning",
        "Company car / fuel card",
        "Onboarding & training",
        "Permanent contract",
        "Small, family-like team",
        "Turkish-speaking team",
        "Career opportunities",
      ],
      followUps: {
        salary_and_bonus_wording: {
          label: "Which figure or range may we name – and how exactly may we describe the bonus?",
          help: "We may only promise in the ads what you write here.",
          placeholder: "e.g. from €3,200 gross full-time, €1,000 welcome bonus after probation",
        },
      },
    },
    q7: {
      group: "Patients & families",
      label: "Which services should we advertise?",
      options: [
        "Basic care",
        "Medical care (SGB V)",
        "Support & relief services (§45b)",
        "Substitute care",
        "Household help",
        "Advisory visits (§37.3)",
        "Intensive / palliative care",
        "Initial advice on care level",
      ],
    },
    q8: {
      label: "Who should we target?",
      options: [
        "Family members (children of those in care)",
        "The people needing care themselves",
        "Families with a newly granted care level",
        "People without a care level (advice)",
        "Turkish-speaking families",
        "Clinics / social services",
      ],
    },
    q9: {
      label: "Why should families choose Fidelis?",
      options: [
        "Free capacity – can take patients immediately",
        "Admission within a few days",
        "Turkish-speaking team",
        "Consistent, familiar carers",
        "Help with applications & care level",
        "Free consultation at home",
        "Many years of experience",
        "Always personally reachable",
      ],
      followUps: {
        monthly_capacity: { label: "How many new patients can you take per month?", placeholder: "e.g. 5 to 8" },
      },
    },
    q10: {
      group: "Enquiries & budget",
      label: "Who handles new enquiries – and how fast?",
      options: [
        "We call within 24 hours",
        "We call within a few days",
        "Contact via WhatsApp",
        "Call back after booking a time",
      ],
      followUps: {
        lead_owner: {
          label: "Who handles new enquiries?",
          placeholder: "e.g. Ms Yılmaz, 0151 …",
        },
      },
    },
    q11: {
      label: "Which monthly budget should we start with?",
      options: ["€500 (as before)", "€750", "€1,000", "€1,500 or more", "Not decided – please advise"],
      followUps: {
        budget_split: {
          label: "If both campaigns run: how should we split the budget?",
          options: ["Focus on hiring", "Evenly", "Focus on patients", "Only one campaign"],
        },
      },
    },
  },
  final: { title: "Done", body: ["That's it – thank you for your time."], submitLabel: "Submit answers" },
  success: {
    title: "Thank you!",
    body: ["We've received your answers.", "We'll prepare the campaigns and get in touch if anything is unclear."],
  },
};
