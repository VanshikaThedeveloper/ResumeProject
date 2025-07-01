const API_BASE = "http://localhost:4000";
import axios from "axios";
import { useState , useEffect, useCallback } from "react"




function App() {


// const handleEnhanceSection = useCallback(async (section) => {
//   const contentToEnhance = formData[section];
//   const content =
//     typeof contentToEnhance === "string"
//       ? contentToEnhance
//       : JSON.stringify(contentToEnhance);

//   try {
//     const res = await fetch(`${API_BASE}/enhance`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ type: section, content }),
//     });

//     const data = await res.json();

//     if (!res.ok) throw new Error(data.error || "Enhancement failed");

//     if (typeof contentToEnhance === "string") {
//       handleChange(section, data.enhanced);
//     } else {
//       const parsed = JSON.parse(data.enhanced);
//       handleChange(section, parsed);
//     }
//   } catch (err) {
//     console.error("AI Enhance Error:", err);
//     alert("⚠️ Failed to enhance section.");
//   }
// }, [formData]);






 
 const colorMap = {
  blue: "sm:bg-[#162456]",
  teal: "sm:bg-[#008080]",
  navy: "sm:bg-[#062e48]",
  green: "sm:bg-[#086f5b]",
  darkred: "sm:bg-[#51011c]",
  darkgreen: "sm:bg-[#043927]",
};

  const [formData ,setFormData] = useState({
    name:"Anish Verma",
    domain: "Fullstack",
    tel: "+564578189",
    mail : "anish@gmail.com",
    city : ",Delhi ,India",
    strength :["self motivated","Process Improvement","Multitasker"],
    skills : ["React","tailwind","Js","NodeJs","SQL"],
    reference : [
      {
        name:"Name",
        profession : "Profession",
        email : "email",

      },
      {
        name:"Name",
        profession : "Profession",
        email : "email",

      }
    ],
    summary : "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae atque, sapiente totam ullam earum laborum debitis sequi, fuga itaque deleniti quos accusamus! Facilis reiciendis molestiae tempore quae eius, reprehenderit repudiandae.",
    education:[
      {
        major : "Enter your major",
        date : "xxxx",
        institute : "enter the institution name"
      },
      {
        major : "Enter your major",
        date : "xxxx",
        institute : "enter the institution name"
      },

    ],
    experience:[
      {
        company : "Company name ",
        date : "xxxx",
        position: "Enter The poistion",
        desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe aut sapiente accusamus similique? Corporis quasi, reprehenderit nesciunt aliquam voluptatem ipsum facere voluptate molestias, fuga vel saepe, quis eaque optio alias!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe aut sapiente accusamus similique? Corporis quasi, reprehenderit nesciunt aliquam voluptatem ipsum facere voluptate molestias, fuga vel saepe, quis eaque optio alias!"
        
      },
       {
        company : "Company name ",
        date : "xxxx",
        position: "Enter The poistion",
        desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe aut sapiente accusamus similique? Corporis quasi, reprehenderit nesciunt aliquam voluptatem ipsum facere voluptate molestias, fuga vel saepe, quis eaque optio alias!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe aut sapiente accusamus similique? Corporis quasi, reprehenderit nesciunt aliquam voluptatem ipsum facere voluptate molestias, fuga vel saepe, quis eaque optio alias!"
        
      },

    ],
     project : [
      {
        name : "Project Name",
        desc: "Enter the project description ..........."
        
      },
      {
        name : "Project Name",
        desc: "Enter the project description ..........."
        
      }
    ],
    achievements : [
      {
        name : "Achievement field",
        desc: "write about your achievements....."
        
      },
      {
        name : "Achievement field",
        desc: "write about your achievements....."
        
      }
    ],
    font:"sarif",
    allFont:["Impact","Sarif","Verdana","cursive","Arial","Noto","Gill Sans","Franklin Gothic Medium","Century Gothic","Calibri"],

    Color : "blue",
    bgColor:["blue","teal","navy","green","darkred","darkgreen",],
    
  })

  const handleChange = (field , val)=>{
    setFormData({...formData ,[field]:val})
  }
 const remove = ((field,index) => {
    const temp = [...formData[field]];
    temp.splice(index,1)
    handleChange(field,temp)
  })



  const add = ((field,value) =>{
    const temp = [...formData[field],value];
    handleChange(field,temp)
  })

   const [downloadshow , setDownloadShow] = useState(false);
   const downloadButton = () => {
    setDownloadShow((prev) => !prev);
   }


   const [Ai , setAi] = useState(false);
   const aiAssButton = () =>{
    setAi((prev) => !prev)
   }

   const [fontbtn , setFont] = useState(false);
   const fontButton = ()=>{
    setFont((prev)=>!prev)
   }
   const changeFont = (e)=>{
    const temp = e.target.innerText
    handleChange('font',temp)

   }

   const [color , setColor] = useState(false);
   const colorButton = ()=>{
    setColor((prev)=>!prev)
   }
   const changeColor = (e)=>{
    const temp = e.target.value
    handleChange('Color',temp)

   }

   const alertmsg = ()=>{
    alert("Backend team was woking ")
     }


  const handleEnhanceSection = async (section) => {
  const rawContent = formData[section];

  // ✨ हमेशा String भेजें
  const content = typeof rawContent === "string"
    ? rawContent
    : JSON.stringify(rawContent, null, 2);   // prettified JSON text

  try {
    const res = await axios.post("http://localhost:4000/enhance", {
      type: section,
      content
    });

    const improved = res.data.enhanced;

    // अभी सिर्फ़ string सेक्शनों को वापस लिखते हैं
    handleChange(section, improved);

  } catch (err) {
    console.error("AI Enhance Error:", err);
    console.error("Backend said:", err?.response?.data); // 👉 असली वजह देखो
    console.log("Full Axios error response:", JSON.stringify(err?.response, null, 2));
    alert("AI failed to enhance");
  }
};

const saveResumeToFile = async () => {
  try {
    const response = await axios.post("http://localhost:4000/save", formData);
    alert(response.data.message);
  } catch (error) {
    console.error("Error saving resume:", error);
     console.log(error?.response?.data); 
    alert("Failed to save resume.");
  }
};

// useEffect(() => {
//   const fetchResume = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/resume/load");
//       const saved = res.data;

//       // ✅ Agar data mil gaya toh setFormData se state set karo
//       setFormData(saved);
//     } catch (error) {
//       console.log("No saved resume found."); // user ne abhi tak save nahi kiya
//     }
//   };

//   fetchResume();
// }, []);


    

  return (
    <div className="flex lg:flex-row flex-col  w-full  bg-gray-200 overflow-x-hidden">

      {/* buttons */}
      <div className=" w-full lg:w-[18%] bg-[#f5f0ebec] flex flex-col  pb-9 items-center px-2 py-10 lg:rounded-r-4xl">

        <h1 className="font-bold text-[1.6rem] border-b mb-3">Resume Tools</h1>
        <div className="   w-[75%] px-2  py-5 flex flex-col  gap-4 items-center justify-center">

          {/* download button */}
          <button className="bg-[#073679] w-[65%] sm:w-[30%] lg:w-full  text-white py-2  rounded-full">Download PDF</button>

          {/* upload resume button */}
          <button className="bg-[#1c728a] w-[65%] sm:w-[30%] lg:w-full  text-white py-2  rounded-full" onClick={downloadButton}>Upload Resume</button>
          {
            downloadshow && (
              <div className="  p-1 w-[65%] sm:w-[30%] lg:w-full  flex flex-col gap-2 items-center justify-center ">
                <button className=" px-2 py-2 w-full  rounded-xl bg-gray-400">Manual-Edit</button>
                <button className=" px-2 py-2 w-full rounded-xl bg-gray-400">Ai-Edit</button>
              </div>
            )
          }

          {/* ai Assistance button */}
          <button className="bg-[#242323]  w-[65%] sm:w-[30%] lg:w-full text-white py-2  rounded-full" onClick={aiAssButton}>Ai Assistance</button>

          {
            Ai && (
              <div className="   p-1 w-[65%] sm:w-[30%] lg:w-full flex flex-col gap-2 ">
                <button onClick={() => handleEnhanceSection("summary")} className=" py-2  px-2  w-full rounded-xl bg-gray-400 ">Enhnace Summary</button>
                <button onClick={() => handleEnhanceSection("achievements")} className=" py-2  px-2  w-full rounded-xl bg-gray-400 ">Enhance Achievements</button>
                <button onClick={() => handleEnhanceSection("experience")} className=" py-2  w-full rounded-xl bg-gray-400 ">Enhnace Experience</button>
                <button onClick={() => handleEnhanceSection("project")} className=" py-2  w-full rounded-xl bg-gray-400 ">Enhnace Project </button>
              </div>
            )
          }  

          {/* save and share button */}

          <button className=" w-[65%] sm:w-[30%] lg:w-full bg-[#63265d] text-white  py-2  rounded-full" onClick={saveResumeToFile}>Save Changes</button>

          <button className="bg-[#820000]  w-[65%] sm:w-[30%] lg:w-full text-white  py-2  rounded-full" onClick={alertmsg}>Share Resume</button>

          {/* color button */}

          <button className=" bg-[#99024e]  w-[65%] sm:w-[30%] lg:w-full text-white  py-2  rounded-full" onClick={colorButton}>Change Color</button>
          {
            color && (
               <div className=" rounded-xl border-2 border-gray-500 p-1 flex flex-wrap items-center justify-center gap-2 font-bold ">
                <button onClick={changeColor} className=" px-9 py-5   rounded-xl bg-[#162456] " value={formData.bgColor[0]}> </button>
                <button onClick={changeColor} className=" px-9 py-5  rounded-xl bg-[#008080] " value={formData.bgColor[1]}>  </button>
                <button onClick={changeColor} className=" px-9 py-5   rounded-xl bg-[#001a20] " value={formData.bgColor[2]}> </button>
                <button onClick={changeColor} className=" px-9 py-5   rounded-xl bg-[#086f5b] "value={formData.bgColor[3]}> </button>
                <button onClick={changeColor} className=" px-9 py-5   rounded-xl bg-[#51011c] " value={formData.bgColor[4]}> </button>
                <button onClick={changeColor} className=" px-9 py-5   rounded-xl bg-[#043927] " value={formData.bgColor[5]}> </button>
                
              </div>
            )
          }

          {/* Font Button */}

          <button className="bg-[#073679]  w-[65%] sm:w-[30%] lg:w-full text-white  py-2  rounded-full" onClick={fontButton}>Change Font</button>

          {
            fontbtn && (
              <div className=" p-1 flex flex-wrap gap-2 justify-center  ">
                {
                  formData.allFont.map((elm,idx)=>(
                    <div key={idx} onClick={changeFont} className="bg-gray-400  w-[65%] sm:w-[30%] lg:w-full text-black p-1  text-center rounded-[5px]">{elm}</div>
                  ))
                }
                

              </div>

            )
          }



          



        </div>

      </div>

      {/* Resume */}
      <div className=" w-[95vw] lg:w-[80vw] xl:w-[70vw] mx-auto border-3 rounded-[10px]  border-[#4B3C35]  mt-6 bg-white p-2 mb-5 text-gray-800 font-sans flex sm:flex-row flex-col-reverse gap-2"  style={{fontFamily : formData.font}}>

        {/* left */}
        <div className={` w-full sm:w-[30%] text-black sm:text-white flex sm:pt-[7rem] flex-col gap-6 p-2 ${colorMap[formData.Color]}`}>

           {/* achievements */}
          <div className="mt-2">
            <h1 className="  text-[1.5rem] sm:text-[1rem] md:text-[1.3rem] font-bold border-b-1 uppercase">🏅Achievements</h1>
            <div className="">
              {
                formData.achievements.map((elm,idx)=>(
                    <div key={idx} className=" flex flex-col gap-1 ">
                        <input type="text" value={elm.name} onChange={(e)=>{
                          const temp = [...formData.achievements];
                          temp[idx] = e.target.value;
                          handleChange('achievements',temp)
                        }} className=" w-full pl-2 uppercase text-[1rem] sm:text-[0.8rem] md:text-[1rem]  font-bold " />

                        
                        <p contentEditable onChange={(e)=>{
                          const temp = [...formData.achievements];
                          temp[idx] = e.target.value;
                          handleChange('achievements',temp)
                          }} 
                          className="p-2 "
                         >{elm.desc}</p>

                        <button className="place-self-start p-1 text-red-500" onClick={()=>remove('achievements',idx)}>Remove</button>
                    </div>
                  ))
              }
            </div>
             <button className="text-blue-400" onClick={()=>add('achievements',{
                    name : "Achievement field",
                   desc: "write about your achievements....."
                   })}>+ Add</button>

          </div>

          {/* Strengths */}
          <div className=" w-full ">
            <h1 className="  text-[1.5rem] sm:text-[1rem] md:text-[1.3rem] font-bold border-b-1 uppercase"> 📖 Strengths</h1>
            <div className=" w-full pt-2 ">
              {
                formData.strength.map((elm ,idx)=>(
                  <div key={idx} className="flex justify-between px-2 gap-2">
                  <input 
                        type="text" 
                        value={elm}
                        onChange={(e)=>{
                          const temp = [...formData.strength]
                          temp[idx] = e.target.value
                          handleChange('strength', temp)
                        }}
                        className="w-full capitalize "
                  />
                  <button className="text-red-500" onClick={()=>remove('strength',idx)}>x</button>
                </div>
                ))
              }
              <button className="text-blue-400" onClick={()=>add('strength','New strength')}>+ Add</button>
            </div>
          </div>


          {/* skills */}

           <div className=" w-full ">
            <h1 className="  text-[1.5rem] sm:text-[1rem] md:text-[1.3rem] font-bold border-b-1 uppercase"> 🖋️ Skills</h1>
            <div className=" w-full pt-2 flex-wrap">
              {
                formData.skills.map((elm ,idx)=>(
                  <div key={idx} className="flex flex-wrap justify-between px-2 gap-2">
                  <input 
                        type="text" 
                        value={elm}
                        onChange={(e)=>{
                          const temp = [...formData.skills]
                          temp[idx] = e.target.value
                          handleChange('skills', temp)
                        }}
                        className="w-[80%] pl-2 rounded-full border-blue-300 border-1 capitalize bg-gray-200 sm:bg-[#00000050] m-1 "
                  />
                  <button className="text-red-500" onClick={()=>remove('skills',idx)}>x</button>
                </div>
                ))
              }
              <button className="text-blue-400" onClick={()=>add('skills','New skill')}>+ Add</button>
            </div>
          </div>


         {/* Reference */}

          <div className=" w-full ">
            <h1 className=" text-[1.5rem] sm:text-[1rem] md:text-[1.3rem] font-bold border-b-1 uppercase">📄 Reference</h1>
            <div className=" w-full pt-2">
              {
                formData.reference.map((elm ,idx)=>(
                  <div key={idx} className="flex flex-col bg-gray-200 sm:bg-[#00000050] px-2 gap-2 mb-2">
                  <input 
                        type="text" 
                        value={elm.name}
                        onChange={(e)=>{
                          const temp = [...formData.reference]
                          temp[idx] = e.target.value
                          handleChange('reference', temp)
                        }}
                        className="w-full capitalize font-bold "
                  />
                    <input 
                        type="text" 
                        value={elm.profession}
                        onChange={(e)=>{
                          const temp = [...formData.reference]
                          temp[idx] = e.target.value
                          handleChange('reference', temp)
                        }}
                        className="w-full capitaliz "
                  />
                    <input 
                        type="email" 
                        value={elm.email}
                        onChange={(e)=>{
                          const temp = [...formData.reference]
                          temp[idx] = e.target.value
                          handleChange('reference', temp)
                        }}
                        className="w-full capitalize "
                  />
                  <button className="text-red-500 place-self-start" onClick={()=>remove('reference',idx)}>Remove</button>
                </div>
                ))
              }
              <button className="text-blue-400" onClick={()=>add('reference',{
              name:"name",
              profession: "feild",
              email: "Email"
            })}>+ Add</button>
            </div>
          </div>



        </div>
        

        {/* right */}
        <div className=" w-full sm:w-[calc(100%-30%)] flex flex-col gap-2">
          {/* name  */}
          <div className="bg-gray-100 w-full p-5 flex flex-col gap-1">
            <input 
                  type="text"
                  value={formData.name}
                  onChange={(e)=>{handleChange('name',e.target.value)}}
                  class = "w-full text-[2.5rem] font-bold "
            />
            <input 
                  type="text"
                  value={formData.domain}
                  onChange={(e)=>{handleChange('domain',e.target.value)}}
                  class = " pl-2 w-[40%] bg-gray-300"
            />
            

          </div>

          {/* contact */}

          <div className=" w-full flex flex-wrap gap-2">
            <div className="flex items-center justify-center ">
                 <label>📞</label>
                <input 
                  type="text"
                  value={formData.tel}
                  onChange={(e)=>handleChange('tel',e.target.value)}
                  className="pl-2 border-2 border-blue-800 rounded-full outline-none"
                />
            </div>

             <div className="flex items-center justify-center ">
                 <label>📩</label>
                <input 
                  type="text"
                  value={formData.mail}
                  onChange={(e)=>handleChange('mail',e.target.value)}
                  className="pl-2 border-2 border-blue-800 rounded-full outline-none"
                />
            </div>

             <div className="flex items-center justify-center ">
                 <label>📍</label>
                <input 
                  type="text"
                  value={formData.city}
                  onChange={(e)=>handleChange('city',e.target.value)}
                  className="pl-2 border-2 border-blue-800 rounded-full outline-none"
                />
            </div>


          </div>

          {/* Summary */}
           <div className=" w-full mt-6 ">
               <h1 className=" text-[1.5rem] font-bold border-b-1 uppercase">🎯summary</h1>
               <div className=" w-full ">
                    <p contentEditable suppressContentEditableWarning={true} className="p-2 text-justify" onChange={(e)=>handleChange('summary',e.target.value)}>{formData.summary}</p>
               </div>
          </div>

          {/* education */}

          <div className="">
            <h1 className=" text-[1.5rem] font-bold border-b-1 uppercase">📘education</h1>
            <div>
                {
                  formData.education.map((elm,idx)=>(
                    <div key={idx} className=" flex flex-col gap-1 mt-2">
                      <div className="flex sm:flex-row flex-col sm:justify-between gap-1">
                        <input type="text" value={elm.major} onChange={(e)=>{
                          const temp = [...formData.education];
                          temp[idx] = e.target.value;
                          handleChange('education',temp)
                        }} className=" w-full pl-2 uppercase font-bold  " />

                        <input type="date" value={elm.date} onChange={(e)=>{
                          const temp = [...formData.education];
                          temp[idx] = e.target.value;
                          handleChange('education',temp)
                        }} className="pl-2 bg-gray-100 border-2 border-gray-200" />
                      </div>
                       <input type="text" value={elm.institute} onChange={(e)=>{
                          const temp = [...formData.education];
                          temp[idx] = e.target.value;
                          handleChange('education',temp)
                        }} className=" w-full pl-2" />

                        <button className="place-self-start p-1 text-red-500" onClick={()=>remove('education',idx)}>Remove</button>
                    </div>
                  ))
                }

            </div>
             <button className="text-blue-400" onClick={()=>add('education',{
                         major: "Enter your major",
                         institute: "Name of institution",
                         date : "2010 - 2012"
                      }
               )} >+ Add</button>

          </div>

          {/* Experience */}
          <div className="mt-2">
            <h1 className=" text-[1.5rem] font-bold border-b-1 uppercase">🏢Experience</h1>
            <div className="mt-2">
              {
                 formData.experience.map((elm,idx)=>(
                    <div key={idx} className=" flex flex-col gap-1 ">
                      <div className="flex sm:flex-row flex-col sm:justify-between gap-1">
                        <input type="text" value={elm.company} onChange={(e)=>{
                          const temp = [...formData.experience];
                          temp[idx] = e.target.value;
                          handleChange('experience',temp)
                        }} className=" w-full pl-2 uppercase font-bold ] " />

                        <input type="date" value={elm.date} onChange={(e)=>{
                          const temp = [...formData.experience];
                          temp[idx] = e.target.value;
                          handleChange('experience',temp)
                        }} className="pl-2 bg-gray-100 " />
                      </div>
                       <input type="text" value={elm.position} onChange={(e)=>{
                          const temp = [...formData.experience];
                          temp[idx] = e.target.value;
                          handleChange('experience',temp)
                        }} className=" w-full   pl-2" />

                        
                        <p contentEditable  onChange={(e)=>{
                          const temp = [...formData.experience];
                          temp[idx] = e.target.value;
                          handleChange('experience',temp)
                         }} 
                         className="p-2 text-justify"
                        >{elm.desc}</p>

                        <button className="place-self-start p-1 text-red-500" onClick={()=>remove('experience',idx)}>Remove</button>
                    </div>
                  ))
                }
            </div>
             <button onClick={()=>add('experience',{
                   company : "Company name ",
                   date : "xxxx",
                    position: "Enter The poistion",
                    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe aut sapiente accusamus similique? Corporis quasi, reprehenderit nesciunt aliquam voluptatem ipsum facere voluptate molestias, fuga vel saepe, quis eaque optio alias!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe aut sapiente accusamus similique? Corporis quasi, reprehenderit nesciunt aliquam voluptatem ipsum facere voluptate molestias, fuga vel saepe, quis eaque optio alias!"
                   }
               )} className="text-blue-400">+ Add</button>
          </div>


          {/* project */}
          <div className="mt-2">
            <h1 className=" text-[1.5rem] font-bold border-b-1 uppercase">🧩Project</h1>
            <div>
              {
                formData.project.map((elm,idx)=>(
                    <div key={idx} className=" flex flex-col gap-1 ">
                        <input type="text" value={elm.name} onChange={(e)=>{
                          const temp = [...formData.project];
                          temp[idx] = e.target.value;
                          handleChange('project',temp)
                        }} className=" w-full pl-2 uppercase   font-bold " />

                        
                        <p contentEditable onChange={(e)=>{
                          const temp = [...formData.project];
                          temp[idx] = e.target.value;
                          handleChange('project',temp)
                          }} 
                          className="p-2 text-justify"
                         >{elm.desc}</p>

                        <button className="place-self-start p-1 text-red-500" onClick={()=>remove('project',idx)}>Remove</button>
                    </div>
                  ))
              }

            </div>
            <button className="text-blue-400" onClick={()=>add('project',{
                     name : "Project Name",
                     desc: "Enter the project description ..........."
                   })}>+ Add</button>
          </div>



        </div>



      </div>

    </div>
    
   
  )
}

export default App
