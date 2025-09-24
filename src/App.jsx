import { useState, useEffect } from 'react'
import { languages } from './languages'
import './App.css'
import {clsx} from 'clsx'
import { getFarewellText, getRandomWord } from './utils'
import Confetti from "react-confetti"


function App() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord()); 

   const [guessedLetter, setGuessedLetters] = useState([]);

   const [farewellMessage, setFarewellMessages] = useState([]);




  // inside App component:
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  function addGuessedLetter(letter) {
    setGuessedLetters(prevLetters => 
      prevLetters.includes(letter) ? 
        prevLetters : 
        [...prevLetters, letter]
    )
  }

  
  const wrongGuessCount = guessedLetter.filter(letter => 
    !currentWord.includes(letter)
  ).length

  const isGameWon = currentWord.split("").every(letter => 
    guessedLetter.includes(letter)
  )

  const isGameLost = wrongGuessCount >= languages.length - 1
  
  const isGameOver = isGameWon || isGameLost

  // const isWinner = isGameWon && !isGameLost

  //  function fairwellText() {
  //   if (!isGameOver) {
  //     return ""
  //   }

  //   if (isGameWon) {
  //     return "You win! Well done! 🎉"
  //   } else {
  //     const lostLanguage = languages[wrongGuessCount - 1]
  //     return utils.getFarewellText(lostLanguage.name)
  //   }
  //  } 
  
  const languageElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount 
    
    const style = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    }
    const className = clsx('language-badge', isLanguageLost && 'lost')
    return (
      <span
        className={className}
        style={style}
        key={lang.name}
      >
        {lang.name}
      </span>
    )
  })
  
  const letterElements = currentWord.split("")
    .map((letter, index) => {
      const isRevealed = isGameLost || guessedLetter.includes(letter)
      const letterClassName = clsx (
        isGameLost && !guessedLetter.includes(letter) && 'missed-letter'
      )
      return (
        <span className={letterClassName} key={index}>
         {isRevealed ? letter.toUpperCase() : ""}
        </span>

      )
      
  })
  
  
  const keyboardElements = alphabet.split("").map(letter => {
    const isGuessed = guessedLetter.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })

    return (
      <button 
        className={className} 
        key={letter}
        disabled={isGameOver} 
        aria-disabled={isGameOver}
        // disabled={isGuessed || isGameOver} 
        // aria-disabled={isGuessed || isGameOver}
        onClick={() => addGuessedLetter(letter)}
      >
        {letter.toUpperCase()}
      </button>
    )
    
  })


  const gameStatusClass = clsx('status-section', {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && Boolean(farewellMessage)
  })

  function renderGameStatus() {
        if (!isGameOver) {
            return null
        }

        if (isGameWon) {
            return (
                <>
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                </>
            )
        } else {
            return (
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            )
        }
    }



  useEffect(() => {
  if (wrongGuessCount > 0) {
    const eliminatedLanguage = languages[wrongGuessCount - 1];
    const message = getFarewellText(eliminatedLanguage.name);

    setFarewellMessages( message);
   } else {
    setFarewellMessages("");
   }
  }, [wrongGuessCount]);

  function resetGame() {
    setGuessedLetters([]);
    setFarewellMessages([]);
    setCurrentWord(getRandomWord());
  }

  return (
    <main>
      {
        isGameWon && 
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={1000}
          gravity={0.5}
          wind={0.01}
          tweenDuration={8000}
        />
      }
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word in under 8 attempts to keep the programming world safe from Assembly!
        </p>
      </header>
      <section aria-live='polite' role='status' className={gameStatusClass}>
        {!isGameOver && farewellMessage  }
        
        {isGameOver && renderGameStatus()}
        
        
        {/* {isGameOver ?  (
          isGameWon ? (
            <>
              <h2>You win!</h2>
              <p>Well done! 🎉 </p>
            </>
          ) : (
            <>
              <h2>Game over!</h2>
              <p>You lose! Better start learning Assembly 😭 </p>
            </>
          )

        ) : (
            null
        )
      } */}
      </section>
      
      <section className='lang-main'>
        <div className='languages-section'>
          {languageElements}
        </div>
      </section>
      

      <section className='word'>
        {letterElements}
      </section>

      <section className='keyboard'>
        {keyboardElements}
      </section>
      <section className='new-game-section'>
        {isGameOver && <button className='new-game-button' onClick={resetGame}>New Game</button>}
      </section>
    </main>
  )
}

export default App
