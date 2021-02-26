import React from "react";
import SlackFeedback from "react-slack-feedback";
import feedBackTheme from "./feedBackTheme";
import useLoadLanguage from "../hooks/useRemoteLoadLanguage";
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

//const tsv = "/localDictionary/components/Shared/FeedBack.tsv";
const tsv = "/components/FeedBack.tsv";
let API_URL = `${publicRuntimeConfig.baseFolder}/api/support/getfeedBack`;

const FeedBack = () => {
    const keyword = useLoadLanguage(tsv);
    const translationJson = {
        "checkbox.option": "Send url with feedback",
        "close": keyword("close"),
        "error.archived": keyword("archived"),
        "error.badrequest": keyword("badrequest"),
        "error.forbidden": keyword("forbidden"),
        "error.internal": keyword("internal"),
        "error.notfound": keyword("notfound"),
        "error.unexpected":  keyword("unexpected"),
        "error.upload": "Error uploading image!",
        "feedback.type.improvement": keyword("improvement"),
        "feedback.type.bug": keyword("bug"),
        "feedback.type.feature": keyword("feature"),
        "header.title": keyword("title"),
        "image.remove": keyword("remove"),
        "label.channel": "Channel",
        "label.message": keyword("message"),
        "label.type": keyword("type"),
        "placeholder": keyword("placeholder"),
        "submit.sending": keyword("sending"),
        "submit.sent": keyword("sent"),
        "submit.text": keyword("submit_text"),
        "upload.text": "Attach Image",
        "trigger.text": keyword("button"),
        "footer.text": "React Slack Feedback"
    };

    const sendToSlack = (payload, success, error) => {

        return fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) {
                    error(res);
                    throw res
                }
                
                return res
            })
            .then(success)
        
    };

    return (
        <div>
            <SlackFeedback
                disabled={false}
                errorTimeout={8 * 1000}
                onClose={() => {
                }}
                onOpen={() => {
                }}
                sentTimeout={5 * 1000}
                showChannel={false}
                showIcon={false}
                theme={feedBackTheme}
                onSubmit={(payload, success, error) =>
                    sendToSlack(payload, success, error)
                }
                user={"Invid Feed Back"}
                translations={translationJson}
            />
        </div>
    )
};
export default FeedBack;