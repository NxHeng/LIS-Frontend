import React, { createContext, useContext, useState } from 'react';

const AnnouncementContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const AnnouncementContextProvider = ({ children }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [announcement, setAnnouncement] = useState();
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [announcementsLoaded, setAnnouncementsLoaded] = useState(false);
    const [announcementLoaded, setAnnouncementLoaded] = useState(false);

    // Fetch all announcements from the backend
    const fetchAnnouncements = async () => {
        try {
            const response = await fetch(`${API_URL}/announcement/getAnnouncements`);
            const data = await response.json();
            // const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setAnnouncements(data);
            setAnnouncementsLoaded(data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            setAnnouncementsLoaded(false);
        }
    };

    //create new announcement to database
    const createAnnouncement = async (announcement) => {
        try {
            const response = await fetch(`${API_URL}/announcement/createAnnouncement`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(announcement),
            });
            const data = await response.json();
            setAnnouncements([...announcements, data]);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    //delete announcements state
    const deleteAnnouncementsState = (announcement) => {
        const newAnnouncements = announcements.filter((a) => a._id !== announcement._id);
        setAnnouncements(newAnnouncements);
    };

    const deleteAnnouncement = async (announcement) => {
        try {
            const response = await fetch(`${API_URL}/announcement/deleteAnnouncement/${announcement._id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete the announcement');
            }

            console.log('Delete successful');

            // Update local state by removing the deleted announcement
            deleteAnnouncementsState(announcement);
        } catch (error) {
            console.error('Error deleting announcement:', error);
        }
    };

    const updateAnnouncementState = (updatedAnnouncement) => {
        const newAnnouncements = announcements.map((a) =>
            a._id === updatedAnnouncement._id ? updatedAnnouncement : a
        );
        setAnnouncements(newAnnouncements);
        setSelectedAnnouncement(updatedAnnouncement);
    };

    // Update announcement in the database
    const updateAnnouncement = async (announcement) => {
        try {
            const response = await fetch(`${API_URL}/announcement/updateAnnouncement/${announcement._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(announcement),
            });

            if (!response.ok) {
                throw new Error('Failed to update the announcement');
            }

            const data = await response.json();
            console.log('Update successful:', data);

            // Update local state with the response data
            updateAnnouncementState(data);
        } catch (error) {
            console.error('Error updating announcement:', error);
        }
    };


    return (
        <AnnouncementContext.Provider value={{
            announcements,
            setAnnouncements,
            announcement,
            setAnnouncement,
            selectedAnnouncement,
            setSelectedAnnouncement,
            announcementsLoaded,
            setAnnouncementsLoaded,
            announcementLoaded,
            setAnnouncementLoaded,
            createAnnouncement,
            deleteAnnouncementsState,
            deleteAnnouncement,
            updateAnnouncement,
            fetchAnnouncements,
        }}>
            {children}
        </AnnouncementContext.Provider>
    );
};

export const useAnnouncementContext = () => useContext(AnnouncementContext);
