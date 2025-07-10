const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    resumeData: {
      name: String,
      role: String,
      phone: String,
      email: String,
      linkedin: String,
      location: String,
      summary: String,

      experience: [
        {
          title: String,
          companyName: String,
          date: String,
          companyLocation: String,
          accomplishment: String,
        },
      ],

      education: [
        {
          degree: String,
          institution: String,
          duration: String,
          location: String,
        },
      ],

      philosophy: {
        quote: String,
        author: String,
      },

      expertise: [
        {
          skill: String,
          value: Number, // 0.8, 0.9 etc
        },
      ],

      strengths: [
        {
          title: String,
          description: String,
        },
      ],

      achievements: [
        {
          title: String,
          description: String,
        },
      ],

      languages: [
        {
          name: String,
          level: String,
          dots: Number,
        },
      ],

      skills: [
        {
          category: String,
          items: [String],
        },
      ],

      projects: [
        {
          title: String,
          description: String,
          year: String,
        },
      ],

      references: [
        {
          name: String,
          title: String,
          contact: String,
        },
      ],
    },

    sectionSettings: {
      header: {
        showTitle: Boolean,
        showPhone: Boolean,
        showLink: Boolean,
        showEmail: Boolean,
        showLocation: Boolean,
        uppercaseName: Boolean,
        showPhoto: Boolean,
      },
      summary: {
        showSummary: Boolean,
      },
      experience: {
        showExperience: Boolean,
      },
      education: {
        showEducation: Boolean,
      },
      achievements: {
        showAchievements: Boolean,
      },
      languages: {
        showLanguages: Boolean,
      },
      skills: {
        showSkills: Boolean,
      },
      philosophy: {
        showPhilosophy: Boolean,
      },
      expertise: {
        showExpertise: Boolean,
      },
      strengths: {
        showStrengths: Boolean,
      },
      references: {
        showReferences: Boolean,
      },
    },

    branding: Boolean,
    sectionsOrder: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Temp13Resume", resumeSchema);



// const mongoose = require("mongoose");

// const resumeSchema = new mongoose.Schema(
//   {
//     resumeData: Object,
//     sectionSettings: Object,
//     branding: Boolean,
//     sectionsOrder: [String],
//   },
//   { timestamps: true }
// );

// const Temp13Resume = mongoose.model("Temp13Resume", resumeSchema);
// module.exports = Temp13Resume;
