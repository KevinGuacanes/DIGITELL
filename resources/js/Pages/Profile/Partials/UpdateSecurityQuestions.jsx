import React, { useState } from "react";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import FloatInputText from "@/Components/FloatInputText";
import { useNotify } from "@/Components/Toast";
import DeleteModal from "@/Components/DeleteModal";

export default function UpdateSecurityQuestions({ className = "" }) {
    const { entries, questions } = usePage().props;
    const [userQuestions, setUserQuestions] = useState(entries);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);
    const notify = useNotify();
    const {
        data,
        setData,
        post,
        errors,
        processing,
        recentlySuccessful,
        reset,
        delete: destroy,
    } = useForm({
        security_question_id: "",
        answer: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("profile.storeSecurityQuestion"), {
            preserveScroll: true,
            onSuccess: (response) => {
                reset();
                notify("success", "Pregunta de seguridad añadida.");
                setUserQuestions(response?.props?.entries);
            },
            onError: (error) => {
                console.error(error.message);
            },
        });
    };

    const deleteQuestion = () => {
        destroy(route("profile.destroySecurityQuestion", questionToDelete), {
            preserveScroll: true,
            onSuccess: () => {
                setUserQuestions(
                    userQuestions.filter((q) => q.id !== questionToDelete),
                );
                setShowDeleteModal(false);
                setQuestionToDelete(null);
                notify("success", "Pregunta de seguridad eliminada.");
            },
            onError: (error) => {
                console.error(error.message);
            },
        });
    };

    const openDeleteModal = (entryId) => {
        setQuestionToDelete(entryId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setQuestionToDelete(null);
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Preguntas de Seguridad
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Configure sus preguntas de seguridad para mayor protección.
                </p>
            </header>

            <div className="mt-6">
                <h3
                    className={`text-md font-medium text-gray-900 dark:text-gray-100`}
                >
                    Preguntas actuales:
                </h3>
                <ul className="mt-2 space-y-2">
                    {userQuestions.length === 0 ? (
                        <li className="text-sm text-gray-500">
                            Aún no hay preguntas de seguridad configuradas.
                        </li>
                    ) : (
                        userQuestions.map((entry) => (
                            <li
                                key={entry.id}
                                className="flex justify-between items-center"
                            >
                                <span>{entry.question.name}</span>
                                <button
                                    onClick={() => openDeleteModal(entry.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
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
                        {questions.map((question) => (
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

                <div>
                    <FloatInputText
                        label="Respuesta"
                        id="answer"
                        className="mt-1 block w-full"
                        value={data.answer}
                        onChange={(e) => setData("answer", e.target.value)}
                        required
                    />
                    <InputError message={errors.answer} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        Agregar Pregunta
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Guardado.
                        </p>
                    </Transition>
                </div>
            </form>

            <DeleteModal
                title="Eliminar pregunta"
                showDelete={showDeleteModal}
                closeDeleteModal={closeDeleteModal}
                handleDelete={deleteQuestion}
                processing={false}
            />
        </section>
    );
}
