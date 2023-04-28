import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FieldError } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";

function Questions() {

    const [questions, setQuestions] = useState<any>("")                            // state that saves the question
    const [correctAnswer, setCorrectAnswer] = useState<any>("")                    // state that saves the correct answer
    const [AllAnswers, setAllAnswers] = useState<any>([])                          // state that saves all answers
    const [selectedAnswer, setSelectedAnswer] = useState<any>("")                  // state that saves the user input
    const [correctMsg, setCorrectMsg] = useState<boolean>(false)                   // state that controls the message of the correct answer
    const [falseMsg, setFalseMsg] = useState<boolean>(false)                       // state that controls the message of the false answer
    const [loadingNewQuestion, setLoadingNewQuestion] = useState<boolean>(false)   // state responsible for triggering useEffect to load new question
    const [validationMsg, setValidationMsg] = useState<boolean>(false)             // state responsible for showing validation msg if the user requested new question without answering the current one

    useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=1")
            .then(response => response.json())
            .then(response => {
                const { results } = response
                const [data] = results
                const { incorrect_answers } = data
                const incorrectAnswersArray = [...incorrect_answers]
                setQuestions(data.question)
                setCorrectAnswer(data.correct_answer)
                setAllAnswers([...incorrectAnswersArray, data.correct_answer])
                setCorrectMsg(false)
                setFalseMsg(false)
                setSelectedAnswer("")
            })
            .catch(error => console.log(error))
    }, [loadingNewQuestion])

    const handleChange = (e: any) => {          // Handles change in the input (This logic in (setSelectedAnswer) to make sure that the first letter in the user's input is capitalized)
        setSelectedAnswer(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))
    }

    const clickingNewQuestionButton = () => {    // Handles clicking on New Question button
        correctMsg || falseMsg ? setLoadingNewQuestion(!loadingNewQuestion) : setValidationMsg(true)
    }


    const schema = Yup.object().shape({
        answer: Yup.string().required("*Answer is required")
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)      // For integration between react-hook-form and yup
    })

    const onSubmit = () => {       // Handles form submission
        selectedAnswer == correctAnswer ? (setCorrectMsg(true), setFalseMsg(false)) : (setFalseMsg(true), setCorrectMsg(false))
        selectedAnswer && setValidationMsg(false)
    }

    return <main className="mt-20 mx-6 md:mx-16 lg:mx-20 lg:w-3/4 xl:w-3/5">

        <h1 className="text-2xl font-bold lg:text-3xl">Q. {questions}</h1>
        <h3 className="mt-7 text-lime-600 text-lg font-semibold">Available Answers:</h3>

        <p className="mt-2 text-lg font-semibold">( {AllAnswers.map((value: any, index: number) => {
            return <span key={index}>{value}, </span>
        })})</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
            <label className="text-lg font-semibold">Type your answer here: </label>
            <input value={selectedAnswer} placeholder="Be sure of the spelling" type="text" {...register("answer", { onChange: handleChange})} className="mx-3 px-2 py-1 border-2 rounded-lg md:w-96" />
            
            {(errors.answer || validationMsg) && (
                <p className="text-red-500 w-96 md: ml-5">{(errors.answer as FieldError)?.message || "*Submit your answer first"}</p>)}
           
            {correctMsg && <p className="mt-4 bg-green-100 text-green-800 px-2 py-2 border border-green-800 rounded-lg">Your answer is correct</p>}
            {falseMsg && <p className="mt-4 bg-red-100 text-red-900 px-2 py-2 border border-red-900 rounded-lg">Your answer is false, the correct answer is {correctAnswer}</p>}
            
            <button type="submit" className="block mt-8 border py-2 px-6 rounded-xl font-semibold text-white bg-lime-600 hover:text-lime-600 hover:bg-white hover:border-lime-600 transition ease-in-out duration-300">SUBMIT</button>
        </form>



        <button onClick={clickingNewQuestionButton} className="block mt-6 mb-3 border border-lime-600 py-2 px-6 rounded-xl font-semibold text-lime-600 bg-white hover:text-white hover:bg-lime-600 hover:border-white transition ease-in-out duration-300">NEXT QUESTION</button>

    </main>
}

export default Questions
