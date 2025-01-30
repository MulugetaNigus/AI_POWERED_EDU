// components/PostCreation.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from '@clerk/clerk-react';
import { Loader2, Send, Podcast, Tags } from 'lucide-react';

const PostCreation: React.FC = () => {
  const [postContent, setPostContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loadingState, setloadingState] = useState(false);
  const [expandPostForm, setexpandPostForm] = useState(false);
  const [error, seterror] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setloadingState(true);
    try {
      await axios.post("http://localhost:8888/api/v1/createPost",
        {
          userID: user?.emailAddresses[0].emailAddress,
          content: postContent,
          likes: 0,
          tags: tags,
          approved: false
        }
      )
        .then((result) => {
          console.log(result);
          setloadingState(false);
          toast.success("Successfully Posted!", {
            position: "top-center",
          });
          setPostContent('');
          setTags([]); // Clear tags after successful submission
        }).catch((err) => {
          setloadingState(false);
          seterror(true);
          console.log(err);
        });
    } catch (error) {
      setloadingState(false);
      seterror(true);
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("full tags:", tags);
  }, [tags]);

  // to toggle the tags selection
  const handleTags = (e: React.MouseEvent<HTMLParagraphElement>) => {
    const tag = e?.currentTarget.textContent;
    if (tag) {
      if (tags.includes(tag)) {
        // If the tag is already selected, remove it from the tags array
        setTags((prev: string[]) => prev.filter((t) => t !== tag));
      } else {
        // If the tag is not selected, add it to the tags array
        setTags((prev: string[]) => [...prev, tag]);
      }
    }
  };

  return (
    <>
      {expandPostForm
        ? (
          <>
            <div className='flex items-center justify-start'>
              <button onClick={() => setexpandPostForm(false)} className='bg-blue-600 p-2 rounded-lg text-white mb-2'>Close Form</button>
            </div>
            <form onSubmit={handleSubmit} className="dark:text-white dark:bg-gray-800 bg-white shadow border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
              <div className='flex items-center justify-start gap-1'>
                <Podcast className='w-5 h-5 text-gray-500' />
                <label htmlFor="#" className='dark:text-white text-gray-500 text-base ml-1'>Create a post</label>
              </div>
              <textarea
                className="dark:bg-gray-800 border-2 dark:border-gray-700 w-full p-2 border rounded-lg resize-none mt-2"
                rows={5}
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              ></textarea>
              {/* error notifier */}
              {
                error &&
                <div className="my-2 border-2 border-red-200 bg-red-100 p-2 rounded-lg ">
                  <p className='text-red-600 small'>Something went wrong, please try again!</p>
                </div>
              }
              {/* tags here */}
              <div className='flex items-center justify-start gap-1'>
                <Tags className='w-5 h-5' />
                <p className='dark:text-white text-gray-500 text-base mt-5 mb-2 ml-1 font-bold'>Tags</p>
              </div>
              <div className='flex items-center justify-start gap-3 flex-wrap'>
                {['Group', 'Dedication', 'Exam-Time', 'Scheduled', 'AI-Assistance', 'AI', 'Collaboration', 'Education', 'Study Smart'].map((tag) => (
                  <p
                    key={tag}
                    className={`border-2 rounded-lg px-4 py-2 text-white font-normal cursor-pointer hover:transition hover:duration-125 hover:ease-out hover:bg-indigo-400 hover:border-indigo-400 
                      ${tags.includes(tag) ? 'bg-indigo-400 border-indigo-400' : 'bg-indigo-600 border-indigo-600'}`}
                    onClick={(e) => handleTags(e)}
                  >
                    {tag}
                  </p>
                ))}
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 mt-12 px-4 py-2 bg-blue-500 text-base text-white rounded-lg hover:bg-blue-600"
              >
                {loadingState
                  ? <Loader2 className='animate-spin w-6 h-6' />
                  : "Post"
                }
                <Send className='w-5 h-5' />
              </button>
            </form>
            <ToastContainer
              draggable
              pauseOnHover={true}
              autoClose={2000}
              transition={Bounce}
            />
          </>
        ) : (
          <div className='flex items-center justify-start'>
            <button onClick={() => setexpandPostForm(true)} className='bg-blue-600 p-2 rounded-lg text-white mb-2'>Create a post</button>
          </div>
        )
      }
    </>
  );
};

export default PostCreation;
