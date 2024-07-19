import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, useForm, Link } from "@inertiajs/react";
import FloatInputText from "@/Components/FloatInputText";
import LoadingSpinner from "@/Components/LoadingSpinner";

export default function SecurityQuestionVerification({ securityQuestions }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        security_question_id: "",
        answer: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.security-questions.verify"));
    };

    return (
        <GuestLayout>
            <Head title="Verificar preguntas de seguridad" />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Por favor ingrese su correo electrónico, seleccione una pregunta
                de seguridad y proporcione su respuesta.
            </div>

            <form onSubmit={submit}>
                <div>
                    <FloatInputText
                        label="Email"
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <label
                        htmlFor="security_question_id"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Pregunta de Seguridad
                    </label>
                    <select
                        id="security_question_id"
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:border-green-600 focus:ring-green-600 sm:text-sm h-12"
                        value={data.security_question_id}
                        onChange={(e) =>
                            setData("security_question_id", e.target.value)
                        }
                        required
                    >
                        <option value="">Seleccione una pregunta</option>
                        {securityQuestions.map((question) => (
                            <option key={question.id} value={question.id}>
                                {question.name}
                            </option>
                        ))}
                    </select>
                    <InputError
                        message={errors.security_question_id}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4">
                    <FloatInputText
                        label="Respuesta"
                        id="answer"
                        type="text"
                        name="answer"
                        value={data.answer}
                        className="mt-1 block w-full"
                        autoComplete="answer"
                        onChange={(e) => setData("answer", e.target.value)}
                        required
                    />
                    <InputError message={errors.answer} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route("password.request")}
                        className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
                    >
                        Regresar
                    </Link>
                    <PrimaryButton className="ms-4" disabled={processing}>
                        {processing ? (
                            <LoadingSpinner text="Verificando..." />
                        ) : (
                            "Verificar"
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
