// components/PostCreation.tsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from '@clerk/clerk-react';
import { Loader2, Send, Tags, Image, Smile, FileText, X, Camera, Upload, Globe, Lock, Users, ChevronDown, Eye } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

const PostCreation: React.FC = () => {
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loadingState, setloadingState] = useState(false);
  const [expandPostForm, setexpandPostForm] = useState(false);
  const [error, seterror] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [postImages, setPostImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [visibilityOption, setVisibilityOption] = useState('public');
  const [showVisibilityOptions, setShowVisibilityOptions] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();

  // Listen for the custom event to expand the post form
  useEffect(() => {
    const handleExpandPostForm = () => {
      setexpandPostForm(true);
    };

    // Add event listener for the custom event
    document.addEventListener('expand-post-form', handleExpandPostForm);

    // Cleanup
    return () => {
      document.removeEventListener('expand-post-form', handleExpandPostForm);
    };
  }, []);

  const visibilityOptions = [
    { id: 'public', name: 'Public', icon: <Globe className="w-4 h-4" /> },
    { id: 'friends', name: 'Friends', icon: <Users className="w-4 h-4" /> },
    { id: 'private', name: 'Only Me', icon: <Lock className="w-4 h-4" /> },
  ];

  const selectedVisibility = visibilityOptions.find(option => option.id === visibilityOption);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) {
      toast.error('Post content cannot be empty!');
      return;
    }

    setloadingState(true);

    const formData = new FormData();
    formData.append('userID', user?.emailAddresses[0].emailAddress || '');
    formData.append('title', postTitle);
    formData.append('content', postContent);
    formData.append('likes', '0');
    formData.append('visibility', visibilityOption);
    formData.append('approved', 'false');
    formData.append('tags', JSON.stringify(tags));

    postImages.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const result = await axios.post(
        'https://extreamx-backend.onrender.com/api/v1/createPost',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setloadingState(false);
      toast.success('Successfully Posted!', {
        position: 'top-right',
      });

      // Reset form
      setPostContent('');
      setPostTitle('');
      setTags([]);
      setPostImages([]);
      setImagePreviewUrls([]);
      setVisibilityOption('public');
      setIsPreviewMode(false);
    } catch (err: any) {
      setloadingState(false);
      seterror(true);
      console.error('Error:', err);
      toast.error(
        err.response?.data?.message || 'Failed to create post. Please try again.'
      );
    }
  };

  // Handle emoji selection
  const onEmojiClick = (emojiData: EmojiClickData) => {
    setPostContent(prevContent => prevContent + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      // Limit to 4 images
      if (postImages.length + filesArray.length > 4) {
        toast.warning("You can upload maximum 4 images");
        return;
      }

      setPostImages(prevImages => [...prevImages, ...filesArray]);

      // Create preview URLs
      const newImageUrls = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prevUrls => [...prevUrls, ...newImageUrls]);
    }
  };

  // Remove image from preview
  const removeImage = (index: number) => {
    setPostImages(prevImages => prevImages.filter((_, i) => i !== index));

    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  };

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

  // QuillJS modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link'],
      ['clean']
    ],
  };

  // QuillJS formats
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
  ];

  // Character counter
  const charCount = postContent.replace(/<[^>]*>/g, '').length;

  return (
    <div id="post-creation">
      {expandPostForm ? (
        <>
          <div className='flex items-center justify-between'>
            <button
              onClick={() => setexpandPostForm(false)}
              className='flex items-center justify-center gap-2 bg-blue-600 p-2 rounded-lg text-white mb-2'
            >
              <X className="w-5 h-5" />
              Close Form
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center justify-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg"
              >
                <Eye className="w-4 h-4" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="dark:text-white dark:bg-gray-800 bg-white shadow border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
            {/* Header with user info and visibility */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {user?.imageUrl && (
                  <img
                    src={user.imageUrl}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{user?.fullName || user?.emailAddresses[0].emailAddress}</p>

                  {/* Visibility selector */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowVisibilityOptions(!showVisibilityOptions)}
                      className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {selectedVisibility?.icon}
                      {selectedVisibility?.name}
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {showVisibilityOptions && (
                      <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg z-10">
                        {visibilityOptions.map(option => (
                          <button
                            key={option.id}
                            type="button"
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                              setVisibilityOption(option.id);
                              setShowVisibilityOptions(false);
                            }}
                          >
                            {option.icon}
                            {option.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Title input */}
            <input
              type="text"
              placeholder="Add a title..."
              className="w-full p-2 text-xl font-bold bg-transparent border-b dark:border-gray-700 focus:outline-none focus:border-blue-500 mb-4"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
            />

            {isPreviewMode ? (
              // Preview mode
              <div className="mt-4">
                {postTitle && <h2 className="text-xl font-bold mb-2">{postTitle}</h2>}
                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: postContent }}
                />

                {/* Image previews in preview mode */}
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          className="w-full h-auto rounded-lg object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags in preview mode */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Edit mode
              <>
                {/* Rich text editor */}
                <ReactQuill
                  theme="snow"
                  value={postContent}
                  onChange={setPostContent}
                  modules={modules}
                  formats={formats}
                  placeholder="What's on your mind?"
                  className="mb-12 post-editor"
                />

                {/* Character counter */}
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4 flex justify-end">
                  {charCount > 0 && (
                    <span className={charCount > 500 ? "text-amber-500" : ""}>
                      {charCount} characters
                    </span>
                  )}
                </div>

                {/* Error notifier */}
                {error && (
                  <div className="my-2 border-2 border-red-200 bg-red-100 p-2 rounded-lg ">
                    <p className='text-red-600 small'>Something went wrong, please try again!</p>
                  </div>
                )}

                {/* Image preview */}
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 opacity-70 hover:opacity-100"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action buttons for extra features */}
                <div className="flex items-center gap-4 my-4 border-t border-b dark:border-gray-700 py-3">
                  {/* Image upload button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <Image className="w-5 h-5" />
                    <span className="text-sm">Photo</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </button>

                  {/* Emoji picker button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <Smile className="w-5 h-5" />
                      <span className="text-sm">Emoji</span>
                    </button>

                    {showEmojiPicker && (
                      <div className="absolute z-10 bottom-10 left-0">
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags section */}
                <div className='flex items-center justify-start gap-1'>
                  <Tags className='w-5 h-5' />
                  <p className='dark:text-white text-gray-500 text-base ml-1 font-bold'>Tags</p>
                </div>
                <div className='flex items-center justify-start gap-3 flex-wrap my-3'>
                  {['Group', 'Dedication', 'Exam-Time', 'Scheduled', 'AI-Assistance', 'AI', 'Collaboration', 'Education', 'Study Smart'].map((tag) => (
                    <p
                      key={tag}
                      className={`border-2 rounded-full px-3 py-1 font-normal cursor-pointer transition duration-200 ease-in-out
                        ${tags.includes(tag)
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                      onClick={(e) => handleTags(e)}
                    >
                      #{tag}
                    </p>
                  ))}
                </div>
              </>
            )}

            {/* Submit button */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={loadingState}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-70"
              >
                {loadingState ? (
                  <Loader2 className='animate-spin w-5 h-5' />
                ) : (
                  <>
                    <span>Publish</span>
                    <Send className='w-4 h-4' />
                  </>
                )}
              </button>
            </div>
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
          <button
            onClick={() => setexpandPostForm(true)}
            className='flex items-center justify-center gap-2 bg-blue-600 p-2.5 rounded-lg text-white mb-2 hover:bg-blue-700 transition duration-200'
          >
            <FileText className="w-5 h-5" />
            Create a post
          </button>
        </div>
      )}

      {/* Add CSS for the rich text editor */}
      <style>
        {`
        .post-editor .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          background: transparent;
        }
        .post-editor .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background: ${expandPostForm ? 'rgba(243, 244, 246, 0.1)' : 'transparent'};
        }
        .post-editor .ql-editor {
          min-height: 150px;
          font-size: 1rem;
          line-height: 1.5;
        }
        .dark .post-editor .ql-snow.ql-toolbar button .ql-stroke,
        .dark .post-editor .ql-snow .ql-toolbar button .ql-stroke,
        .dark .post-editor .ql-snow.ql-toolbar button .ql-fill,
        .dark .post-editor .ql-snow .ql-toolbar button .ql-fill,
        .dark .post-editor .ql-snow.ql-toolbar .ql-picker-label .ql-stroke,
        .dark .post-editor .ql-snow .ql-toolbar .ql-picker-label .ql-stroke {
          stroke: #e5e7eb;
        }
        .dark .post-editor .ql-snow.ql-toolbar button:hover .ql-stroke,
        .dark .post-editor .ql-snow .ql-toolbar button:hover .ql-stroke {
          stroke: #fff;
        }
        .dark .post-editor .ql-snow.ql-toolbar button:hover .ql-fill,
        .dark .post-editor .ql-snow .ql-toolbar button:hover .ql-fill {
          fill: #fff;
        }
        .dark .post-editor .ql-editor.ql-blank::before {
          color: rgba(229, 231, 235, 0.6);
        }
        `}
      </style>
    </div>
  );
};

export default PostCreation;