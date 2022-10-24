import x from "../../assets/x.svg"
import AnswerCircle from "../../Components/AnswerCircle"
import { useState } from "react"
import CSS from "../SingleLevel/SingleLevel.css"
import { useNavigate } from "react-router-dom"
import { useLayoutEffect } from "react"
import { useAuth } from "../../Components/context"
import { useRef } from "react"

function Multiplication() {
  const [activeButton, setActiveButton] = useState()
  const [sign, setSign] = useState()
  const [randomNumber, setRandomNumber] = useState(()=> Math.ceil(Math.random() * 6))
  const [randomNumber2, setRandomNumber2] = useState(()=> Math.ceil(Math.random() * 7))
  const [randomIndex, setRandomIndex] = useState(()=> Math.floor(Math.random() * 4))
  const correctAnswer = randomNumber * randomNumber2
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [score, setScore] = useState(0)
  const answers = removeDuplicateNumbers([correctAnswer + 3, correctAnswer * 2, correctAnswer + 5, correctAnswer - 1], 4)
  answers[randomIndex] = correctAnswer
  const {setGlobalScore, setCompletedLevelName, setGlobalHighScore} = useAuth()
  const floatingScoreRef = useRef()
  const navigate = useNavigate()


  useLayoutEffect(()=>{
    document.body.classList = []
    document.body.classList.add("purple")
    setSign("X")
    setCompletedLevelName("multiplication")
  }, [])

  function showFloatingNumber(ref, numberToDisplay){
    ref.current.textContent = numberToDisplay
    ref.current.classList.add("visible")
    setTimeout(() => {
    ref.current.classList.remove("visible")   
    }, 1000)
}
  function removeDuplicateNumbers(array, arrayLength){
    let newArr = [...new Set(array)]
    if (arrayLength !== newArr.length) {
      newArr.push(65)
      }
          return newArr
  }
  function highScoreSetter(currentScore, category){
    let prevHs = localStorage.getItem(`math-game-hs-${category}`)

    if (prevHs == null) {
      setGlobalHighScore(currentScore)
      localStorage.setItem(`math-game-hs-${category}`, currentScore)
    }else{
      if (currentScore >= prevHs) {
        localStorage.setItem(`math-game-hs-${category}`, currentScore)
        setGlobalHighScore(currentScore)

      }else{
      }
    }
  }
 function leaveGameConfirmation(){
    const leaveGame = confirm("are you sure you want to leave the game?")
    leaveGame ? navigate ("/category") : ""
  }
  function handleButtonClick(){
    if (currentQuestion == 5) {
      if (activeButton == correctAnswer){
        setGlobalScore(score + 20)
        highScoreSetter(score + 20, "multiplication")
        navigate("/score")
    }else{
        setGlobalScore(score)
        highScoreSetter(score, "multiplication")
        floatingScoreRef.current.classList.add("visible")
    }         
    }else{
      if (activeButton == correctAnswer) {
        setScore((prev)=> prev + 20)
        nextGame()
     }
     else if (activeButton !== correctAnswer) {
     navigator.vibrate(250)
     floatingScoreRef.current.classList.add("visible")
     }
    } 
  }
  function nextGame(){
    if (currentQuestion == 5) {
      return navigate("/score")
    }
    setRandomNumber( Math.ceil(Math.random() * 6))
        setRandomNumber2( Math.ceil(Math.random() * 7))
        setActiveButton(null)
        setCurrentQuestion((prev)=> prev + 1)    
        setRandomIndex(Math.floor(Math.random() * 4)) 
  }


  const answerButtons = answers.map((answer, index)=>{
    return <AnswerCircle 
    answer={answer}
    key={index}
    index={index}
    activeButton={activeButton}
    setActiveButton={setActiveButton}
    />
  })

  return (
    <main className="gameplay-main">
      <div className="x-container">
        <img 
        src={x} 
        onClick={()=> leaveGameConfirmation()}
        alt="exit game" 
        className="cancel"/>
      </div>
        

        <p className="progress">
          Question {currentQuestion} of 5
        </p>

        <p className="question">
            {randomNumber + sign + randomNumber2}=?
        </p>

        <div className="answers">
            {answerButtons}
        </div>

        <button 
        onClick={()=>{ handleButtonClick() }}
        className={activeButton != null | activeButton != undefined? "" : "disabled"}
        >Next Question</button>

    <div 
        ref={floatingScoreRef}        
        className="overlay">
          <div
        className="score-showcase">
          <p>Oops, that's not the right answer, {`${randomNumber} ${sign} ${randomNumber2}`} is actually<span> {correctAnswer}</span></p>

          <button
          onClick={()=>{
            floatingScoreRef.current.classList.remove("visible")
            nextGame()
          }}
          >Continue</button>
        </div>
          </div>
    </main>
  )
}

export default Multiplication