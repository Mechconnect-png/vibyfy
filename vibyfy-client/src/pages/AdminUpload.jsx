import { useState } from "react";
import { uploadSong } from "../services/uploadService";
import { Upload, Music, Image } from "lucide-react";
import toast from "react-hot-toast";
const AdminUpload = () => {

  const [form, setForm] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    mood: "happy",
    duration: "",
  });

  const [cover, setCover] = useState(null);
  const [audio, setAudio] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  const [uploading, setUploading] = useState(false);


  const handleCover = (file) => {
    setCover(file);

    if(file){
      setCoverPreview(URL.createObjectURL(file));
    }
  };


  const handleAudio = (file) => {

    setAudio(file);

    if(file){

      const audioElement = new Audio();

      audioElement.src = URL.createObjectURL(file);

      audioElement.onloadedmetadata = () => {

        const minutes = Math.floor(
          audioElement.duration / 60
        );

        const seconds = Math.floor(
          audioElement.duration % 60
        )
        .toString()
        .padStart(2,"0");


        setForm(prev => ({
          ...prev,
          duration:`${minutes}:${seconds}`
        }));

      };
    }
  };



  const handleUpload = async()=>{

    if(!form.title || !form.artist){
      toast.error("Enter song title and artist");
      return;
    }


    if(!cover){
      toast.error("Select cover image");
      return;
    }


    if(!audio){
      toast.error("Select MP3 file");
      return;
    }


    try{

      setUploading(true);


      await uploadSong({

        ...form,

        coverFile:cover,

        audioFile:audio

      });



      toast.success("🎵 Song uploaded successfully");


      setForm({
        title:"",
        artist:"",
        album:"",
        genre:"",
        mood:"happy",
        duration:"",
      });


      setCover(null);
      setAudio(null);
      setCoverPreview("");



    }
    catch(error){

      console.error(
        JSON.stringify(error,null,2)
      );

      toast.error("Upload failed. Check console");

    }
    finally{

      setUploading(false);

    }

  };



return (

<div className="max-w-3xl mx-auto bg-slate-900 rounded-2xl p-8">


<h1 className="text-3xl font-bold mb-8">
 Upload New Song
</h1>



<div className="grid gap-5">


<input
placeholder="Song Title"
className="bg-slate-800 p-4 rounded-lg"
value={form.title}
onChange={(e)=>
setForm({...form,title:e.target.value})
}
/>



<input
placeholder="Artist"
className="bg-slate-800 p-4 rounded-lg"
value={form.artist}
onChange={(e)=>
setForm({...form,artist:e.target.value})
}
/>



<input
placeholder="Album"
className="bg-slate-800 p-4 rounded-lg"
value={form.album}
onChange={(e)=>
setForm({...form,album:e.target.value})
}
/>



<input
placeholder="Genre"
className="bg-slate-800 p-4 rounded-lg"
value={form.genre}
onChange={(e)=>
setForm({...form,genre:e.target.value})
}
/>



<select
className="bg-slate-800 p-4 rounded-lg"
value={form.mood}
onChange={(e)=>
setForm({...form,mood:e.target.value})
}
>

<option value="happy">Happy</option>
<option value="sad">Sad</option>
<option value="calm">Calm</option>
<option value="energetic">Energetic</option>
<option value="relief">Relief</option>
<option value="neutral">Neutral</option>
<option value="love">Love</option>
<option value="relax">Relax</option>
<option value="motivation">Motivation</option>
<option value="angry">Angry</option>
<option value="sleep">Sleep</option>
<option value="focus">Focus</option>
<option value="party">Party</option>  
<option value="workout">Workout</option>  
<option value="chill">Chill</option>  
<option value="romantic">Romantic</option>
<option value="nostalgic">Nostalgic</option>
<option value="vintage">Vintage</option>  
<option value="adventurous">Adventurous</option> 
</select>




<input
className="bg-slate-800 p-4 rounded-lg"
value={form.duration}
readOnly
placeholder="Auto detected duration"
/>




<div>

<label className="font-semibold flex gap-2 items-center">
<Image size={18}/>
Cover Image
</label>


<input
type="file"
accept="image/*"
onChange={(e)=>
handleCover(e.target.files[0])
}
/>


{coverPreview && (

<img
src={coverPreview}
className="mt-4 w-32 h-32 rounded-xl object-cover"
/>

)}

</div>




<div>

<label className="font-semibold flex gap-2 items-center">
<Music size={18}/>
MP3 File
</label>


<input
type="file"
accept="audio/*"
onChange={(e)=>
handleAudio(e.target.files[0])
}
/>


{
audio &&
<p className="text-sm text-gray-400 mt-2">
{audio.name}
</p>
}

</div>




<button

onClick={handleUpload}

disabled={uploading}

className="
bg-purple-600 
hover:bg-purple-700
rounded-xl 
py-4 
font-bold
flex
justify-center
items-center
gap-2
disabled:opacity-50
"

>

<Upload size={20}/>

{
uploading
?
"Uploading..."
:
"Upload Song"
}


</button>


</div>


</div>

);

};


export default AdminUpload;