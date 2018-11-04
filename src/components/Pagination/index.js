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

const _GetLink = ({ number, basePath, current, setCurrentPage, setImages }) => (
    <li className={current ? 'active waves-effect' : 'waves-effect'}>
        <Link onClick={() => {setCurrentPage(number); setImages([])}} to={`${basePath}/${number}`}>{number}</Link>
    </li>
);
const GetLink = connect(null, mapDispatchToProps)(_GetLink);

const mapStateToProps = mapDynamicState('images currentUser currentPage', 'gallery');
const mapDispatchToProps2 = dispatch => ({
    setImages: currentPage => dispatch(setImages(currentPage)),
});

class Pagination extends Component {
    state = {
        currentPage: 1,
        imagesPerPage: 30,
        pagesNumber: 3,
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if(this.props.currentPage !== nextProps.currentPage) this.request();
        return true;
    }

    request = () => {
        const { currentPage, currentUser, setImages } = this.props;
        const req = {
            username: currentUser,
            page: currentPage,
        };
        emit.retrieveImagesByUser(req);
        on.retrieveImagesFromDB(images => {
            console.log(images)
            setImages(images);
        })
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
        const { pagesNumber, imagesPerPage } = this.state;
        const { images, currentPage, basePath } = this.props;
        let nextPages = [];
        for (let i = 1; i <= pagesNumber-2; i++) {
            const newPage = Number(currentPage) + i;
            if(imagesPerPage === images.length) {
                nextPages.push(<GetLink key={newPage} basePath={basePath} number={newPage} />)
            }
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