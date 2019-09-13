import React, { Component } from 'react';
import Pusher from 'pusher-js';
import pushid from 'pushid';
import '../../styles/card.css';
import Article from './article.js';
import { connect } from 'react-redux';

class ArticleList extends Component {

    componentDidMount() {
        const pusher = new Pusher('5994b268d4758d733605', {
            cluster: 'us2',
            encrypted: true,
        });

        const channel = pusher.subscribe('news-channel');
        channel.bind('update-news', data => {
            this.setState({
                newsArticles: [...data.articles, ...this.props.newsArticles],
            });
        });
    }

    render() {
        let newsArticles = noData;
        if (this.props.newsArticles && this.props.newsArticles.length > 0) {
            newsArticles = this.props.newsArticles.map((article)  => <Article article={article} id={pushid()} />);
        }

        return (
            <div className="App">
                <center><h5 className="App-title">Recent Crypto News</h5></center>

                <ul className="news-items">{newsArticles}</ul>
            </div>
        );
    }
}

const noData = (
    <div className="dashboard-section section">
          <div className="rounded-card card z-depth-0">
            <li>
                <div className="card-content">
                    <span >No recent news </span>
                </div>
            </li>
          </div>
        </div>
    );
     
const mapStateToProps = (state) => {
    console.log(state);
    return {
        newsArticles: state.news.newsArticles,
    }
}

export default connect(mapStateToProps)(ArticleList);