import React, { Component } from 'react';
import Pusher from 'pusher-js';
import pushid from 'pushid';
import '../../styles/card.css';
import Article from './article.js';
import { connect } from 'react-redux';
import '../../styles/card.css';
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button'
import { getNewsData } from '../store/actions/newsAction';

class ArticleList extends Component {

    constructor(props) {
		super(props);
		this.state = {
            newsArticles: [],
            collapsed: true
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

        this.props.getNewsData();
    }
    
    newArray(x,y) {
        let d = []
        x.concat(y).forEach(item =>{
           if (d.find((iterator) => iterator.title  === item.title) === undefined) 
             d.push(item); 
        });
        return d;
      }

    toggleCollapse = () => {
        this.setState({collapsed: !this.state.collapsed})
    }

    render() {
        let newsArticles = noData;
        let articles = [];

        if (this.state.newsArticles && this.state.newsArticles.length > 0) {
            articles = [...this.state.newsArticles];
        }
        if (this.props.newsArticles !== undefined && this.props.newsArticles !== null && this.props.newsArticles.length > 0) {
            articles = this.newArray(articles, this.props.newsArticles)
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
                <center><h5 onClick={() => this.toggleCollapse()} className="article-list-title App-title">Recent Crypto News
                    <Button className="collapse-articles" button >
                        {this.state.collapsed ? <ExpandLess /> : <ExpandMore />}
                    </Button></h5>
                </center>
                <ul className="news-items">
                    <Collapse in={this.state.collapsed} >
                        {newsArticles}
                    </Collapse>
                </ul>
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

export default connect(mapStateToProps, {getNewsData})(ArticleList);