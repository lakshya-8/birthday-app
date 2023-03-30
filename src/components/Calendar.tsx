import React, { useState, useCallback } from 'react';
import dayjs from 'dayjs'
import _ from "lodash";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import styled from 'styled-components';
import * as UIStrings from "../constants/uiStrings";
import BirthdaySearch from './SearchBar';
import BirthdayList from './BirthdayList';

const CalendarWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    align-items: flex-start;
    margin-left: 20%;
    margin-right: 20%;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 20px;
`;

const TopContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const RightContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-height: 500px%;
    overflow: auto;
    padding-left:20px;
    background: aliceblue;
    min-width: 330px;
    max-height: 403px;
`;

const LeftContainer = styled.div`
    display: flex;
    flex-direction: column;
    border: solid;
    border-width: 1px;
    border-color: #dddddd;
    padding: 5px;
`;

const FavoriteBirthdaysContainer = styled.div`
    display: flex
    flex-direction: column;
`;

const BirthdayListContainer = styled.ul`
    list-style-type: none;
    margin-top: 30px;
    padding: 0;
    max-height: 400px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border-top: solid;
    border-width: 1px;
    border-color: #dddddd;
    margin: 0px;
    background: azure:
`;
const StyledList = styled(List)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;


export type Birthday = {
    year: number;
    text: string;
};

export type Favorites = {
    [date: string]: Birthday[];
};

const Calendar: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
    const [birthdays, setBirthdays] = useState<Birthday[]>([]);
    const [favorites, setFavorites] = useState<Favorites>({});
    const [filteredBirthdays, setFilteredBirthdays] = useState<Birthday[]>([]);

    const handleDateChange = async (selectedDate: dayjs.Dayjs) => {
        setSelectedDate(selectedDate);
        const date = selectedDate.toDate()

        try {
            if (date) {
                const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/${dayjs(date).format("MM/DD")}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.births) {
                    setBirthdays(data.births);
                    setFilteredBirthdays(data.births);
                } else {
                    setBirthdays([]);
                    setFilteredBirthdays([]);
                }
            }
            else {
                setBirthdays([]);
            }
        } catch (err) {
            setBirthdays([]);
        }
    };

    const handleToggleFavorite = (birthday: Birthday) => {
        const formattedSelectedDate = selectedDate.format("MM/DD")
        if (favorites[formattedSelectedDate]?.some((fav) => fav.year === birthday.year && fav.text === birthday.text)) {
            const filteredFavorites = favorites[formattedSelectedDate].filter((fav) => !(fav.year === birthday.year && fav.text === birthday.text))
            const hasMoreFavDates = !_.isEmpty(favorites)
            if (hasMoreFavDates) {
                const updatedFavorites = { ...favorites, [formattedSelectedDate]: filteredFavorites }
                if (_.isEmpty(filteredFavorites)) {
                    delete updatedFavorites[formattedSelectedDate]
                }
                setFavorites(updatedFavorites);
            } else {
                setFavorites({});
            }

        } else {
            const updatedBirthdays = favorites[formattedSelectedDate] ? [...favorites[formattedSelectedDate], birthday] : [birthday]
            setFavorites({ ...favorites, [formattedSelectedDate]: updatedBirthdays });
        }
    }

    const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value.toLowerCase();
        const filtered = birthdays.filter((birthday) =>
            birthday.text.toLowerCase().includes(searchTerm)
        );
        setFilteredBirthdays(filtered);
    }, [setFilteredBirthdays, birthdays]);

    return (
        <CalendarWrapper>
            <Title>{UIStrings.BIRTHDAY_APP_TITLE}</Title>
            <TopContainer>
                <LeftContainer>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            value={selectedDate}
                            onChange={handleDateChange as (value: dayjs.Dayjs | null, selectionState?: any) => void}
                            views={['month', 'day']}
                        />
                    </LocalizationProvider>
                    <BirthdaySearch handleSearchChange={handleSearchChange} />
                </LeftContainer>
                <RightContainer>
                    <Typography variant='h6' fontWeight={"bold"}>{UIStrings.FAVORITE_BIRTHDAYS_LABEL}</Typography>
                    <FavoriteBirthdaysContainer>
                        {!_.isEmpty(favorites) ? Object.keys(favorites).map((fav, i) => (
                            <StyledList key={`heading-${i}`}>
                                <Typography variant='h6' fontWeight={"bold"}>{dayjs(fav).format("MMMM DD")}</Typography>
                                {favorites[fav].map((birthday, index) => (
                                    <ListItem key={`fav-item-${index}`}>
                                        <ListItemText primary={birthday.text} />
                                    </ListItem>
                                ))}
                            </StyledList>
                        )) : <Typography fontStyle={"italic"}>{UIStrings.NO_FAVORITE_BIRTHDAYS_SELECTED_LABEL}</Typography>
                        }
                    </FavoriteBirthdaysContainer>
                </RightContainer>
            </TopContainer>
            <BirthdayListContainer>
                <BirthdayList
                    selectedDate={selectedDate}
                    favorites={favorites}
                    filteredBirthdays={filteredBirthdays}
                    handleToggleFavorite={handleToggleFavorite} />
            </BirthdayListContainer>
        </CalendarWrapper >
    );
};

export default Calendar;
