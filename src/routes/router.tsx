import { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import HomeLayout from '../Layouts/HomeLayout';
import GroupLayout from '../Layouts/GroupLayout';
import WatchLayout from '../Layouts/WatchLayout';
import GuestGuard from '../containers/auth/GuestGuard';
import { Signin, Signup } from '../pages/auth';
import AuthGuard from '../containers/auth/AuthGuard';
import ProfilePage from '../pages/section/ProfilePage';
import TopBar from '../Layouts/TopBar';
import HomePage from '../pages/section/HomePage';
import WatchPage from '../pages/section/WatchPage';
import ChatPopUp from '../Components/ChatPopUp/ChatPopUp';
import WithModalNoitify from '../Components/Notify/WithModalNoitify';
import MainProfile from '../pages/section/ProfilePage/BottomProfile/MainProfile';
import FriendProfile from '../pages/section/ProfilePage/BottomProfile/FriendProfile';
import PhotoProfile from '../pages/section/ProfilePage/BottomProfile/PhotoProfile';
import AboutProfile from '../pages/section/ProfilePage/BottomProfile/IntroduceProfile';
import CommunityPage from '../pages/section/CommunityPage';
import MainCommunity from '../pages/section/CommunityPage/BottomCommunity/MainCommunity';
import GroupMembers from '../pages/section/CommunityPage/BottomCommunity/MemberCommunity';
import PendingCommunity from '../pages/section/CommunityPage/BottomCommunity/PendingCommunity';
import PinCommunity from '../pages/section/CommunityPage/BottomCommunity/PinCommunity';
import MediaCommunity from '../pages/section/CommunityPage/BottomCommunity/PhotoProfile';
import CommunityOverView from '../pages/section/CommunityOverView';
import FriendLayout from '../Layouts/FriendLayout';
import FriendsPage from '../pages/section/FriendPage';
import FriendRequestsPage from '../pages/section/FriendPage/RequestFriend';
import SearchLayout from '../Layouts/SearchLayout';
import UserSearchPage from '../pages/section/SearchPage/User';
import CommunitySearchPage from '../pages/section/SearchPage/Community';
import PageSearchPage from '../pages/section/SearchPage/Page';
import SuggestFriendPage from '../pages/section/FriendPage/SuggestFriend';
import VideoProfile from '../pages/section/ProfilePage/BottomProfile/Video';


const Router: FC = () => {

  const routes = useRoutes([
    {
      path: "auth",
      element: <GuestGuard />,
      children: [
        { index: true, path: 'sign-in', element: <Signin /> },
        { path: 'sign-up', element: <Signup /> },
      ],
    },
    {
      element: (
        <AuthGuard>
          <TopBar />
          <ChatPopUp />
        </AuthGuard>
      ),
      children: [
        {
          element: <HomeLayout />,
          children: [
            { 
              path: '/', 
              element: <HomePage />,
            },
            {
              path: '/post/:postId', 
              element: 
                <>
                  <HomePage/>
                  <WithModalNoitify/>
                </>,
            }
          ],
        },
        {
          element: <GroupLayout />,
          path: '/community',
          children: [
            { 
              path: '', 
              element: <CommunityOverView />,
            },
            {
              element: <CommunityPage />,
              path: ':communityId',
              children: [
                { 
                  index:true,
                  path: '', 
                  element: <MainCommunity />,
                },
                { 
                  path: 'pin', 
                  element: <PinCommunity />,
                },
                { 
                  path: 'members', 
                  element: <GroupMembers />,
                },
                { 
                  path: 'media', 
                  element: <MediaCommunity />,
                },
                { 
                  path: 'pending', 
                  element: <PendingCommunity />,
                },
              ],
            }
          ]
        },
        {
          element: <WatchLayout />,
          children: [{ index: true, path: '/watch', element: <WatchPage /> }],
        },
        {
          element: <SearchLayout />,
          path: '/search',
          children: [
            { 
              index:true,
              path: '', 
              element: <UserSearchPage />,
            },
            { 
              path: 'community', 
              element: <CommunitySearchPage />,
            },
            { 
              path: 'page', 
              element: <PageSearchPage />,
            },
          ],
        },
        {
          element: <FriendLayout />,
          path: '/friend',
          children: [
            { 
              index:true,
              path: '', 
              element: <FriendsPage />,
            },
            { 
              path: 'list', 
              element: <FriendsPage />,
            },
            { 
              path: 'requests', 
              element: <FriendRequestsPage />,
            },
            { 
              path: 'suggest', 
              element: <SuggestFriendPage />,
            },
          ],
        },
        {
          element: <ProfilePage />,
          path: '/profile/:id',
          children: [
            { 
              index:true,
              path: '', 
              element: <MainProfile />,
            },
            { 
              path: 'friends', 
              element: <FriendProfile />,
            },
            { 
              path: 'photos', 
              element: <PhotoProfile />,
            },
            { 
              path: 'about', 
              element: <AboutProfile />,
            },
            { 
              path: 'videos', 
              element: <VideoProfile />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      {routes}
    </>
  );
};

export default Router;
