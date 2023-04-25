import { useState, useEffect } from "react";

function Questions() {

    const [questions, setQuestions] = useState<any>("")
    const [correctAnswers, setCorrectAnswers] = useState<any>("")
    const [incorrectAnswers, setIncorrectAnswers] = useState<any>([])

    useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=1")
            .then(response => response.json())
            .then(response => {
                const { results } = response
                const [data] = results
                setQuestions(data.question)
                setCorrectAnswers(data.correct_answer)
                setIncorrectAnswers(data.incorrect_answers)
            })
    }, [])

    console.log(incorrectAnswers);
    

    return <main>
        <h1>{questions}</h1>
    </main>
}

export default Questions