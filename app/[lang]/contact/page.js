
import ContactUs from "@SEGMENT/ContactUs";
export default async function Support({params}) {
    const par = await params
    const LANG = par.lang

    return (
        <ContactUs LANG={LANG} />        
    )
}