import React from 'react'
import '../../styles/card.css';

const Article = ({article, id}) => {
    let url = article.urlToImage;
  return (
    <li key={id}>
        <div className="rounded-card card z-depth-0 project-summary">
        <div className="card-content grey-text text-darken-3">
        <img className="thumbnail" src={url} />
            <span className="card-title"> {article.title}</span>
            <a href={`${article.url}`} target="_blank">Read More</a>
        </div>
        </div>
    </li> 
  )
}

export default Article;
