import Link from "next/link";
import { TelegramBotCta } from "@/components/TelegramBotCta";
import { getSiteContacts } from "@/lib/contacts";

export function ContactsPage() {
  const { telegram } = getSiteContacts();

  return (
    <>
      <nav className="breadcrumb">
        <Link href="/">Главная</Link> / Контакты
      </nav>
      <h1 className="page-title">Контакты</h1>
      <p className="section-lead">
        Все обращения в Агентство принимаются через официальный Telegram-бот.
      </p>

      <TelegramBotCta />

      <section className="ardfm-section">
        <h2>Как пользоваться</h2>
        <ol className="contacts-steps">
          <li>Откройте Telegram на телефоне или компьютере.</li>
          <li>
            Перейдите по ссылке{" "}
            <a href={telegram.url} target="_blank" rel="noreferrer">
              {telegram.url}
            </a>{" "}
            или найдите бота по имени <strong>{telegram.handle}</strong>.
          </li>
          <li>Нажмите «Запустить» / Start и следуйте подсказкам бота.</li>
          <li>Опишите суть обращения и приложите документы при необходимости.</li>
        </ol>
      </section>

      <section className="ardfm-section">
        <h2>Полезные разделы</h2>
        <ul className="doc-list">
          <li>
            <Link href="/about/faq">Часто задаваемые вопросы</Link>
          </li>
          <li>
            <Link href="/documents/1">Документы Агентства</Link>
          </li>
          <li>
            <Link href="/activities/directions">Направления деятельности</Link>
          </li>
        </ul>
      </section>
    </>
  );
}
