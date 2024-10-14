
import ContactUs from "@SEGMENT/ContactUs";
export default async function Support({params}) {
    const LANG = params.lang

    return (
        <ContactUs LANG={LANG} />        
    )
}