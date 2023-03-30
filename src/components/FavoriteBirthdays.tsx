import React, { ReactElement } from "react";
import { Favorites } from "./Calendar";
import dayjs from 'dayjs'
import _ from "lodash";
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import styled from 'styled-components';
import * as UIStrings from "../constants/uiStrings";

const StyledList = styled(List)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

export interface FavoriteBirthdaysProps {
    favorites: Favorites,
}

const FavoriteBirthdays: React.FC<FavoriteBirthdaysProps> = ({ favorites }): ReactElement => (
    <React.Fragment>
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
    </React.Fragment>
);

export default FavoriteBirthdays;