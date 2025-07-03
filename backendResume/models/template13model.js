// const mongoose = require("mongoose");

// const resumeSchema = new mongoose.Schema(
//   {
//     resumeData: {
//       name: { type: String },
//       role: { type: String },
//       phone: { type: String },
//       email: { type: String },
//       linkedin: { type: String },
//       location: { type: String },
//       summary: { type: String },

//       experience: [
//         {
//           title: { type: String },
//           companyName: { type: String },
//           date: { type: String },
//           companyLocation: { type: String },
//           accomplishment: { type: String },
//         },
//       ],

//       education: [
//         {
//           degree: { type: String },
//           institution: { type: String },
//           duration: { type: String },
//           location: { type: String },
//         },
//       ],

//       philosophy: {
//         quote: { type: String },
//         author: { type: String },
//       },

//       expertise: [
//         {
//           skill: { type: String },
//           value: { type: Number }, // 0.8, 0.9 etc
//         },
//       ],

//       strengths: [
//         {
//           title: { type: String },
//           description: { type: String },
//         },
//       ],

//       achievements: [
//         {
//           title: { type: String },
//           description: { type: String },
//         },
//       ],

//       languages: [
//         {
//           name: { type: String },
//           level: { type: String },
//           dots: { type: Number },
//         },
//       ],

//       skills: [
//         {
//           category: { type: String },
//           items: [{ type: String }],
//         },
//       ],

//       references: [
//         {
//           name: { type: String },
//           title: { type: String },
//           contact: { type: String },
//         },
//       ],
//     },

//     sectionSettings: {
//       header: {
//         showTitle: { type: Boolean },
//         showPhone: { type: Boolean },
//         showLink: { type: Boolean },
//         showEmail: { type: Boolean },
//         showLocation: { type: Boolean },
//         uppercaseName: { type: Boolean },
//         showPhoto: { type: Boolean },
//       },
//       summary: {
//         showSummary: { type: Boolean },
//       },
//       experience: {
//         showExperience: { type: Boolean },
//       },
//       education: {
//         showEducation: { type: Boolean },
//       },
//       achievements: {
//         showAchievements: { type: Boolean },
//       },
//       languages: {
//         showLanguages: { type: Boolean },
//       },
//       skills: {
//         showSkills: { type: Boolean },
//       },
//       philosophy: {
//         showPhilosophy: { type: Boolean },
//       },
//       expertise: {
//         showExpertise: { type: Boolean },
//       },
//       strengths: {
//         showStrengths: { type: Boolean },
//       },
//       references: {
//         showReferences: { type: Boolean },
//       },
//     },

//     branding: { type: Boolean },

//     sectionsOrder: [{ type: String }],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Temp13Resume", resumeSchema);




const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    resumeData: Object,
    sectionSettings: Object,
    branding: Boolean,
    sectionsOrder: [String],
  },
  { timestamps: true }
);

const Temp13Resume = mongoose.model("Temp13Resume", resumeSchema);
module.exports = Temp13Resume;
