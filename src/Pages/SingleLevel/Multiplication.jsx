import x from "../../assets/x.svg"
import AnswerCircle from "../../Components/AnswerCircle"
import { useState } from "react"
import CSS from "../SingleLevel/SingleLevel.css"
import { useNavigate, useParams } from "react-router-dom"
import { useLayoutEffect } from "react"
import { useAuth } from "../../Components/context"
import { useRef } from "react"

function Multiplication() {
  const [activeButton, setActiveButton] = useState()
  const {operation} = useParams()
  const [sign, setSign] = useState()
  const [randomNumber, setRandomNumber] = useState(()=> Math.ceil(Math.random() * 6))
  const [randomNumber2, setRandomNumber2] = useState(()=> Math.ceil(Math.random() * 7))
  const [randomIndex, setRandomIndex] = useState(()=> Math.floor(Math.random() * 4))
  const correctAnswer = randomNumber * randomNumber2
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [score, setScore] = useState(0)
  const answers = [correctAnswer + 3, correctAnswer * 2, correctAnswer + 5, correctAnswer - 1]
  answers[randomIndex] = correctAnswer
  const {globalScore, setGlobalScore, setCompletedLevelName} = useAuth()
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



  const answerButtons = answers.map((answer, index)=>{
    return <AnswerCircle 
    answer={answer}
    key={index}
    index={index}
    activeButton={activeButton}
    setActiveButton={setActiveButton}
    />
  })

  function leaveGameConfirmation(){
    const leaveGame = confirm("are you sure you want to leave the game?")
    leaveGame ? navigate ("/category") : ""
  }

  function handleButtonClick(){
    floatingScoreRef.current.classList.add("visible")
    setTimeout(() => {
        floatingScoreRef.current.classList.remove("visible")   
    }, 1000);
    if (currentQuestion == 5) {
      if (activeButton == correctAnswer){
        setGlobalScore(score + 20)
    }else{
         setGlobalScore(score)
    }       
      navigate("/score") 
    }else{
      if (activeButton == correctAnswer) {
        setScore((prev)=> prev + 20)
        showFloatingNumber(floatingScoreRef, "+20")
     }
     else if (activeButton !== correctAnswer) {
     navigator.vibrate(250)
     showFloatingNumber(floatingScoreRef, "+0")
     }
     setRandomNumber( Math.ceil(Math.random() * 6))
     setRandomNumber2( Math.ceil(Math.random() * 7))
     setActiveButton(null)
     setCurrentQuestion((prev)=> prev + 1)    
     setRandomIndex(Math.floor(Math.random() * 4)) 
    } 
  }


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

        <p 
        ref={floatingScoreRef}
        className="score-showcase">+20</p>
    </main>
  )
}

export default Multiplication