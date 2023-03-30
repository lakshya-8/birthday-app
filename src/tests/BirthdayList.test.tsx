import { render, screen, fireEvent } from '@testing-library/react';
import BirthdayList, { BirthdayListProps } from '../components/BirthdayList';
import dayjs from 'dayjs';

describe('BirthdayList', () => {
    const favorites = {};
    const filteredBirthdays = [
        {
            text: 'John Doe',
            year: 1990
        },
        {
            text: 'Jane Doe',
            year: 1995
        },
    ];
    const handleToggleFavorite = jest.fn();
    const selectedDate = dayjs('2022-03-30');

    const defaultProps: BirthdayListProps = {
        favorites,
        filteredBirthdays,
        handleToggleFavorite,
        selectedDate,
    };

    it('renders the birthday list with correct title and items', () => {
        render(<BirthdayList {...defaultProps} />);
        expect(screen.getByText('Birthdays on March 30')).toBeInTheDocument();

        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(2);
        expect(listItems[0]).toHaveTextContent('John Doe');
        expect(listItems[1]).toHaveTextContent('Jane Doe');
    });

    it('calls handleToggleFavorite when clicking the flag icon', () => {
        render(<BirthdayList {...defaultProps} />);
        const flagIcons = screen.getAllByRole('button');
        fireEvent.click(flagIcons[0]);
        expect(handleToggleFavorite).toHaveBeenCalledWith(filteredBirthdays[0]);
    });
});
