import React, { Component } from 'react';
import Pusher from 'pusher-js';
import pushid from 'pushid';
import '../../styles/card.css';
import Article from './article.js';
import { connect } from 'react-redux';
import '../../styles/card.css';

class ArticleList extends Component {

    constructor(props) {
		super(props);
		this.state = {
			newsArticles: []
		};
	}

    componentDidMount() {
        const pusher = new Pusher('5994b268d4758d733605', {
            cluster: 'us2',
            encrypted: true
            });

        const channel = pusher.subscribe('news-channel');
        channel.bind('update-news', data => {
            this.setState({
                newsArticles: [data.articles, ...this.state.newsArticles],
            });
        });
    }

    render() {
        let newsArticles = noData;
        let articles = [];

        if (this.state.newsArticles && this.state.newsArticles.length > 0) {
            articles = [...this.state.newsArticles];
        }
        if (this.props.newsArticles !== undefined && this.props.newsArticles !== null && this.props.newsArticles.length > 0) {
            articles = [...articles, ...this.props.newsArticles]
        }
        if (articles.length > 0) {
            newsArticles = articles.sort((a, b) => {
                if (a.publishedAt !== undefined && b.publishedAt !== undefined) {
                    return a.publishedAt < b.publishedAt ? 1 : -1
                } else if (a.publishedAt !== undefined && b.published_on !== undefined) {
                    const bT = new Date(b.published_on * 1000)
                    const aT = new Date(a.publishedAt)
                    return aT < bT ? 1 : -1
                }
                else if (a.published_on !== undefined && b.publishedAt !== undefined) {
                    const bT = new Date(b.publishedAt)
                    const aT = new Date(a.published_on * 1000)
                    return aT < bT ? 1 : -1
                }
                else {
                    return a.published_on < b.published_on ? 1 : -1
                }
            }).map((article)  => <Article article={article} id={pushid()} />);
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