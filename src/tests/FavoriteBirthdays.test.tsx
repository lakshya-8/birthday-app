import { render, screen } from '@testing-library/react';
import FavoriteBirthdays, { FavoriteBirthdaysProps } from '../components/FavoriteBirthdays';
import * as UIStrings from "../constants/uiStrings";

describe('FavoriteBirthdays', () => {
    const favorites = {
        '03/30': [
            {
                text: 'John Doe',
                year: 1990,
                month: 3,
                day: 30,
            },
        ],
        '03/31': [
            {
                text: 'Joe Doe',
                year: 1995,
                month: 3,
                day: 31,
            },
        ],
    };

    const defaultProps: FavoriteBirthdaysProps = {
        favorites,
    };

    it('renders the favorite birthdays with correct headings and items', () => {
        render(<FavoriteBirthdays {...defaultProps} />);
        const headings = screen.getAllByRole('heading');
        expect(headings).toHaveLength(2);
        expect(headings[0]).toHaveTextContent('March 30');
        expect(headings[1]).toHaveTextContent('March 31');

        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(2);
        expect(listItems[0]).toHaveTextContent('John Doe');
        expect(listItems[1]).toHaveTextContent('Joe Doe');
    });

    it('renders a message when there are no favorite birthdays', () => {
        const propsWithoutFavorites: FavoriteBirthdaysProps = {
            favorites: {},
        };
        render(<FavoriteBirthdays {...propsWithoutFavorites} />);
        const message = screen.getByText(UIStrings.NO_FAVORITE_BIRTHDAYS_SELECTED_LABEL);
        expect(message).toBeInTheDocument();
    });
});
