import React, { Component } from 'react';
import Pusher from 'pusher-js';
import pushid from 'pushid';
import '../../styles/card.css';
import Article from './article.js';

class ArticleList extends Component {
  state = {
    newsItems: [],
  }

  componentDidMount() {
    fetch('https://mighty-dawn-74394.herokuapp.com/live')
      .then(response => response.json())
      .then(articles => {
        this.setState({
          newsItems: [...this.state.newsItems, ...articles],
        });
      }).catch(error => console.log(error));

    const pusher = new Pusher('5994b268d4758d733605', {
      cluster: 'us2',
      encrypted: true,
    });

    const channel = pusher.subscribe('news-channel');
    channel.bind('update-news', data => {
      this.setState({
        newsItems: [...data.articles, ...this.state.newsItems],
      });
    });
  }

  render() {
   
    const newsArticles = this.state.newsItems.map((article)  => <Article article={article} id={pushid()} />);

    return (
      <div className="App">
        <center><h5 className="App-title">Recent Crypto News</h5></center>

        <ul className="news-items">{newsArticles}</ul>
      </div>
    );
  }
}

export default ArticleList;