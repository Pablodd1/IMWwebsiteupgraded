import styles from './blog.module.scss';
import { getDictionary } from '@JSON/index';

const Blog = async ({ LANG, BLOG }) => {
    const DATA = await getDictionary(LANG || 'en', BLOG);
    const renderContent = (content, index) => {
        const { h, p, level } = content;
        const HeadingTag = `h${level}`;

        return (
            <div key={h} className={styles[`level${level}`]}>
                {
                    index !== 0 &&
                    <HeadingTag className={styles.heading}>
                        {h}
                        {level !== 4 && <div className={styles.des} />}
                    </HeadingTag>
                }
                {p.map((paragraph, index) => (
                    <p key={index} className={styles.paragraph}>
                        {paragraph}
                    </p>
                ))}
            </div>
        );
    };

    return (
        <article id='blog_renderer' className={styles.blogContainer}>
            {DATA.map((content, index) => renderContent(content, index))}
        </article>
    );
};

export default Blog;
