import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FieldError } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";

function Questions() {

    const [questions, setQuestions] = useState<any>("")
    const [correctAnswers, setCorrectAnswers] = useState<any>("")
    const [AllAnswers, setAllAnswers] = useState<any>([])
    const [selectedAnswer, setSelectedAnswer] = useState<any>("")

    useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=1")
            .then(response => response.json())
            .then(response => {
                const { results } = response
                const [data] = results
                const { incorrect_answers } = data
                const incorrectAnswersArray = [...incorrect_answers]
                setQuestions(data.question)
                setCorrectAnswers(data.correct_answer)
                setAllAnswers([...incorrectAnswersArray, data.correct_answer])
            })
            .catch(error => console.log(error))
    }, [])

    const schema = Yup.object().shape({
        answer: Yup.string().required("*Answer is required")
    });

    type Inputs = {};
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

    return <main>
        <h1>{questions}</h1>
        <h3>Available Answers:</h3>

        <p>( {AllAnswers.map((value: any, index: number) => {
            return <span key={index}>{value}, </span>
        })})</p>

        <form onSubmit={handleSubmit(onSubmit)}>
            <label>Type your answer here: </label>
            <input placeholder="Be sure of the spelling" type="text" {...register("answer", { onChange: (e) => setSelectedAnswer(e.target.value) })} />
            {errors.answer && (
                <p className="text-red-500 w-96 md: ml-5">{(errors.answer as FieldError).message}</p>)}
            <button type="submit">SUBMIT</button>
        </form>

    </main>
}

export default Questions