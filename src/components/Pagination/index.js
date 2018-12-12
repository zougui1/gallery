import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { mapDynamicState } from '../../utils';
import { gallery } from '../../store/actions';
import { emit, on } from '../../socket/user';

const {
  setCurrentPage,
  setImages,
} = gallery;

const mapDispatchToProps = dispatch => ({
    setCurrentPage: currentPage => dispatch(setCurrentPage(currentPage)),
    setImages: images => dispatch(setImages(images)),
});

const _GetLink = ({ number, basePath, current, setCurrentPage, setImages, children }) => (
    <li className={current ? 'active waves-effect' : 'waves-effect'}>
        <Link onClick={() => {setCurrentPage(number); setImages([])}} to={`${basePath}/${number}`}>{children | number}</Link>
    </li>
);
const GetLink = connect(null, mapDispatchToProps)(_GetLink);

const mapStateToProps = mapDynamicState('images currentUser currentPage filter', 'gallery');
const mapDispatchToProps2 = dispatch => ({
    setImages: currentPage => dispatch(setImages(currentPage)),
});

class Pagination extends Component {
    state = {
        currentPage: 1,
        imagesPerPage: 30,
        pagesNumber: 3,
        lastPage: 0,
    }

    componentDidMount = () => {
      this.request();
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(prevProps.filter !== this.props.filter) {
            this.getLastPage();
        }
    }

    request = () => {
        const { currentPage, currentUser, setImages, filter } = this.props;
        let req = {
            username: currentUser,
            page: Number(currentPage),
            tags: filter,
        };
        emit.getImagesByUserAndTags(req);
        on.retrieveImagesFromDB(images => {
            setImages(images);
        });
        this.getLastPage();
    }

    getLastPage = () => {
        const { currentPage, currentUser, filter } = this.props;
        let req = {
            username: currentUser,
            page: Number(currentPage),
            tags: filter,
        };
        emit.getFinalPage(req);
        on.retrieveImagesCount(count => {
            this.setState({
                lastPage: Math.ceil(count / this.state.imagesPerPage)
            });
        });
    }

    getLink = number => <GetLink number={number} basePath={this.props.basePath} />;

    getPreviousPages = () => {
        const { pagesNumber } = this.state;
        const { currentPage, basePath } = this.props;
        let previousPages = [];
        for (let i = pagesNumber; i >= 0; i--) {
            const newPage = currentPage - i;
            if (newPage > 0 && newPage < currentPage) {
                previousPages.push(<GetLink key={newPage} basePath={basePath} number={newPage} />)
            }
        }
        return previousPages;
    }

    getNextPages = () => {
        const { pagesNumber, lastPage } = this.state;
        const { currentPage, basePath } = this.props;
        let nextPages = [];
        for (let i = 1; i <= pagesNumber; i++) {
            const newPage = Number(currentPage) + i;
            if(newPage <= lastPage)
                nextPages.push(<GetLink key={newPage} basePath={basePath} number={newPage} />)
        }
        return nextPages;
    }


  render() {
    return (
      <div>
        <ul className="pagination">
            {this.getPreviousPages()}
            <GetLink current basePath={this.props.basePath} number={this.props.currentPage} />
            {this.getNextPages()}
        </ul>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps2)(Pagination);
