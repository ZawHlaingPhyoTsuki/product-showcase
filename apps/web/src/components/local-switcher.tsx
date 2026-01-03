import { useLocale, useTranslations } from "next-intl";
import { locales } from "@/i18n/config";
import LocaleSwitcherSelect from "./local-switcher-select";

export default function LocaleSwitcher() {
	const t = useTranslations("LocaleSwitcher");
	const locale = useLocale();

	return (
		<LocaleSwitcherSelect
			defaultValue={locale}
			items={locales.map((locale) => ({
				value: locale,
				label: t(locale),
			}))}
			label={t("label")}
		/>
	);
}
