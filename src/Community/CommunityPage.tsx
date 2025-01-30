// CommunityPage.tsx
import React, { useState } from 'react';
import UserProfile from './UserProfile';
import Navigation from './Navigation';
import PostCreation from './PostCreation';
import Feed from './Feed';
import PopularGroups from './PopularGroups';
import TrendingTopics from './TrendingTopics';
import Header from '../components/Header';
import CreateGroupForm from './CreateGroupForm';

const CommunityPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'chat'>('feed');
    const [postCreationModal, setpostCreationModal] = useState(false);

    return (
        <div className="mx-auto px-4 py-8">
            {/* Header */}
            <div className="w-full mb-24">
                <Header />
            </div>

            {/* Main Content Area */}
            <div className="flex">
                {/* Left Sidebar - Fixed User Profile & Navigation */}
                <div className="w-1/4 pr-4">
                    <div className="fixed top-24 left-4 w-1/4">
                        <UserProfile />
                        <Navigation postCreationModal={postCreationModal} setpostCreationModal={setpostCreationModal} />
                    </div>
                </div>

                {/* Center - Scrollable Main Content */}
                <div className="w-2/4 px-4 overflow-y-auto h-screen">
                    {postCreationModal ? (
                        <CreateGroupForm />
                    ) : (
                        <>
                            <PostCreation />
                            <Feed />
                        </>
                    )}
                </div>

                {/* Right Sidebar - Fixed Popular Groups & Trending Topics */}
                <div className="w-1/4 pl-4">
                    <div className="fixed top-24 right-4 w-1/4">
                        <PopularGroups />
                        {/* <TrendingTopics /> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;