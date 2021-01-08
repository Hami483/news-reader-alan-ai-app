import React, { useState, useEffect } from 'react'
import { Typography } from '@material-ui/core';
import alanBtn from '@alan-ai/alan-sdk-web'


import wordsToNumbers from 'words-to-numbers'

import  NewsCards  from './components/newscards/news-cards'
import useStyles from './styles.js'




const alanKey = process.env.REACT_APP_ALAN_KEY

const App = () => {
    const [newsArticles, setNewsArticles] = useState([]);
    const [activeArticle, setActiveArticle] = useState(-1)
    const classes = useStyles()

    useEffect(() => {
        alanBtn({
            key: alanKey,
            onCommand: ({ command, articles, number }) => {
                if (command === 'newHeadlines') {
                    setNewsArticles(articles)
                    setActiveArticle(-1)
                } else if (command === 'highlight') {
                    setActiveArticle((prevActiveArticle) => prevActiveArticle + 1)
                } else if (command === 'open') {
                    const parsedNumber = number.length > 2 ? wordsToNumbers((number), { fuzzy: true }) : number;
                    const article = articles[parsedNumber - 1];

                    if (parsedNumber > 20) {
                        alanBtn().playText('Please try that again.')
                    } else if (article) {
                        window.open(article.url, '_blank')
                        alanBtn().playText('Opening...')
                    } else {
                        alanBtn().playText('Please try that again...')
                    }
                }
            }
        })
    }, [])

    return (
        <div>
            <div className={classes.logoContainer}>
                {newsArticles.length ? (
                    <div className={classes.infoContainer}>
                        <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Open article number [5]</Typography></div>
                        <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Go back</Typography></div>
                    </div>
                ) : null}
                <img src='https://thumbs.dreamstime.com/b/ai-artificial-intelligence-machine-learning-big-data-analysis-automation-technology-business-industrial-manufacturing-132528154.jpg' className={classes.logo} alt="AI Logo" />
            </div>
            <NewsCards articles={newsArticles} activeArticle={activeArticle} />
        </div>
    )
}

export default App