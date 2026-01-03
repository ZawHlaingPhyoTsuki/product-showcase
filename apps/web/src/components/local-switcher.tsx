import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherSelect from "./local-switcher-select";

export default function LocaleSwitcher() {
	const t = useTranslations("LocaleSwitcher");
	const locale = useLocale();

	return (
		<LocaleSwitcherSelect
			defaultValue={locale}
			items={[
				{
					value: "en",
					label: t("en"),
				},
				{
					value: "mm",
					label: t("mm"),
				},
				{
					value: "th",
					label: t("th"),
				},
			]}
			label={t("label")}
		/>
	);
}
