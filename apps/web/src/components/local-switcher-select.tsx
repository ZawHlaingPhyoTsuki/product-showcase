"use client";

import clsx from "clsx";
import { Languages } from "lucide-react";
import { useTransition } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Locale } from "@/i18n/config";
import { setUserLocale } from "@/i18n/locale";

type Props = {
	defaultValue: string;
	items: Array<{ value: string; label: string }>;
	label: string;
};

export default function LocaleSwitcherSelect({
	defaultValue,
	items,
	label,
}: Props) {
	const [isPending, startTransition] = useTransition();

	function onChange(value: string | null) {
		if (!value) return;
		startTransition(() => {
			setUserLocale(value as Locale);
		});
	}

	return (
		<Select value={defaultValue} onValueChange={onChange}>
			<SelectTrigger
				aria-label={label}
				className={clsx(
					"rounded-sm p-2 transition-colors",
					isPending && "pointer-events-none opacity-60",
				)}
			>
				<Languages className="h-6 w-6 text-slate-600" />
				<SelectValue className="sr-only" />
			</SelectTrigger>

			<SelectContent align="end">
				{items.map((item) => (
					<SelectItem
						key={item.value}
						className="flex cursor-default items-center px-3 py-2 text-base"
						value={item.value}
					>
						<span className="">{item.label}</span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
