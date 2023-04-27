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


    const schema = Yup.object().shape({
        answer: Yup.string().required("*Answer is required")
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)      // For integration between react-hook-form and yup
    })

    const onSubmit = () => {
        selectedAnswer == correctAnswer ? (setCorrectMsg(true), setFalseMsg(false)) : (setFalseMsg(true), setCorrectMsg(false))
        selectedAnswer && setValidationMsg(false)
    }

    return <main>

        <h1 className="text-red">{questions}</h1>
        <h3>Available Answers:</h3>

        <p>( {AllAnswers.map((value: any, index: number) => {
            return <span key={index}>{value}, </span>
        })})</p>

        <form onSubmit={handleSubmit(onSubmit)}>
            <label>Type your answer here: </label>
            <input placeholder="Be sure of the spelling" type="text" {...register("answer", { onChange: (e) => setSelectedAnswer(e.target.value) })} />
            {(errors.answer || validationMsg) && (
                <p className="text-red-500 w-96 md: ml-5">{(errors.answer as FieldError)?.message || "*Submit your answer first"}</p>)}
            <button type="submit">SUBMIT</button>
        </form>

        {correctMsg && <p>Your answer is correct</p>}
        {falseMsg && <p>Your answer is false, the correct answer is {correctAnswer}</p>}

        <button onClick={() => correctMsg || falseMsg ? setLoadingNewQuestion(!loadingNewQuestion) : setValidationMsg(true)}>NEXT QUESTION</button>

    </main>
}

export default Questions
