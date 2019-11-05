import React from 'react'
import '../../styles/card.css';
import moment from 'moment';

const Article = ({article, id}) => {
    let url = article.urlToImage !== undefined ? article.urlToImage : article.imageurl;
    const date = article.publishedAt !== undefined ? moment(article.publishedAt).format("llll") :
      moment(article.published_on * 1000).format("llll")
  return (
    <li key={id}>
        <div className="rounded-card card z-depth-0 project-summary">
            <div className="card-content grey-text text-darken-3">
                <img className="thumbnail" src={url} />
                <div className="card-title"> {article.title}</div>
                <div className="articleDate">{date}</div>
                <a href={`${article.url}`} target="_blank">Read More</a>
            </div>
        </div>
    </li> 
  );
}

export default Article;
