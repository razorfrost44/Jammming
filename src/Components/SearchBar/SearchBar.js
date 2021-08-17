import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor (props) {
        super(props);
        this.state = { searchTerm: 'Enter A Song, Album, or Artist' };
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleTermChange (e) {
        const newTerm = e.target.value;
        this.setState({ searchTerm: newTerm });
    }

    handleClick () {
        this.search();
    }

    search () {
        this.props.onSearch(this.state.searchTerm);
    }

    render () {
        return (
            <div className="SearchBar">
                <input placeholder={this.state.searchTerm} onChange={this.handleTermChange} />
                <button className="SearchButton" onClick={this.handleClick}>SEARCH</button>
            </div>
        );
    }
}

export default SearchBar;