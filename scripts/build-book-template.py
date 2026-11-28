"""
Builds the lead-list spreadsheet template offered at workagedleads.com/book
(the "Build the list" section, appendix Step 1 of *Nobody Answers*).

    python3 scripts/build-book-template.py

Writes public/downloads/nobody-answers-lead-list-template.{xlsx,csv}. Both are
committed; re-run and commit them together whenever this script changes.

Column names, column notes and the six status values are the appendix's own
words. Do not rename them here without changing the book.
"""

import csv
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.worksheet.datavalidation import DataValidation

OUT = Path(__file__).resolve().parent.parent / "public" / "downloads"
XLSX = OUT / "nobody-answers-lead-list-template.xlsx"
CSV = OUT / "nobody-answers-lead-list-template.csv"

# (column, what goes in it, width): the appendix Step 1 table, verbatim.
COLUMNS = [
    ("Name", "First and last", 22),
    ("Email", "", 28),
    ("Phone", "", 16),
    ("Town", "And roughly how far from you, so you know whether to offer video", 22),
    ("Date they asked", "The date on the lead form", 15),
    ("What they asked about", "In their words, if the form has them", 32),
    ("Batch and cost", "Which purchase they came from, and what you paid per name", 20),
    ("Status", "One of: never called, tried, talked, wrote a policy, long list, do not contact", 16),
    ("Last contact", "Date and how", 18),
    ("Next step", "What you promised, and when", 28),
    ("Text permission", "Blank, or the date, how they said yes, and where the proof is saved", 30),
    ("Notes", "Short. The after-call notes (Step 5) hold the detail", 40),
]
STATUSES = ["never called", "tried", "talked", "wrote a policy", "long list", "do not contact"]
TODAY_KINDS = ["draft to read", "promise due", "reply to answer", "flag"]

HEADER_FONT = Font(bold=True, color="FFFFFF")
HEADER_FILL = PatternFill("solid", fgColor="1E3A5F")
WRAP = Alignment(wrap_text=True, vertical="top")
ROWS = 2000


def header(ws, names_widths):
    for i, (name, width) in enumerate(names_widths, start=1):
        c = ws.cell(row=1, column=i, value=name)
        c.font = HEADER_FONT
        c.fill = HEADER_FILL
        c.alignment = Alignment(vertical="center")
        ws.column_dimensions[c.column_letter].width = width
    ws.freeze_panes = "A2"


def build():
    wb = Workbook()

    # --- Read me -------------------------------------------------------------
    readme = wb.active
    readme.title = "Read me"
    readme.column_dimensions["A"].width = 24
    readme.column_dimensions["B"].width = 90
    lines = [
        ("Nobody Answers: the list", None),
        ("One spreadsheet with every lead you own, one person per row.", None),
        ("Guide", "workagedleads.com/book"),
        ("", None),
        ("Tabs", None),
        ("List", "Everyone you've bought. The twelve columns from Step 1."),
        ("Today", "One place where everything that needs you lands (Step 3). When it's empty, the week is done."),
        ("Monthly numbers", "Your five numbers, plus dials, real conversations, sales on video and hours worked (Step 9)."),
        ("", None),
        ("Never put these in any assistant, ever", "Social Security numbers, bank account or card numbers, policy numbers, or anything your carriers' rules say to keep out."),
        ("", None),
        ("The columns", None),
    ] + [(n, d or "") for n, d, _ in COLUMNS]
    for r, (a, b) in enumerate(lines, start=1):
        readme.cell(row=r, column=1, value=a)
        if b is not None:
            readme.cell(row=r, column=2, value=b).alignment = WRAP
    readme["A1"].font = Font(bold=True, size=14)
    for r in (5, 12):
        readme.cell(row=r, column=1).font = Font(bold=True)
    readme.cell(row=10, column=1).font = Font(bold=True, color="B91C1C")
    readme.cell(row=10, column=1).alignment = WRAP

    # --- Status values (validation source) -----------------------------------
    lists = wb.create_sheet("Lists")
    lists["A1"] = "Status"
    lists["B1"] = "Today kind"
    for i, s in enumerate(STATUSES, start=2):
        lists.cell(row=i, column=1, value=s)
    for i, k in enumerate(TODAY_KINDS, start=2):
        lists.cell(row=i, column=2, value=k)
    lists["A1"].font = lists["B1"].font = Font(bold=True)
    lists.sheet_state = "hidden"

    # --- List ----------------------------------------------------------------
    ws = wb.create_sheet("List", 1)
    header(ws, [(n, w) for n, _, w in COLUMNS])
    for i, (_, note, _) in enumerate(COLUMNS, start=1):
        if note:
            from openpyxl.comments import Comment
            ws.cell(row=1, column=i).comment = Comment(note, "Nobody Answers")
    status_col = [n for n, _, _ in COLUMNS].index("Status") + 1
    letter = ws.cell(row=1, column=status_col).column_letter
    dv = DataValidation(type="list", formula1=f"=Lists!$A$2:$A${len(STATUSES) + 1}", allow_blank=True)
    dv.error = "Use one of the six status values."
    dv.errorTitle = "Status"
    ws.add_data_validation(dv)
    dv.add(f"{letter}2:{letter}{ROWS}")
    ws.auto_filter.ref = f"A1:{ws.cell(row=1, column=len(COLUMNS)).column_letter}1"

    # --- Today ---------------------------------------------------------------
    today = wb.create_sheet("Today", 2)
    header(today, [("Date", 12), ("Who", 22), ("What", 50), ("Kind", 16), ("Done", 8)])
    dv2 = DataValidation(type="list", formula1=f"=Lists!$B$2:$B${len(TODAY_KINDS) + 1}", allow_blank=True)
    today.add_data_validation(dv2)
    dv2.add(f"D2:D{ROWS}")

    # --- Monthly numbers -------------------------------------------------------
    nums = wb.create_sheet("Monthly numbers", 3)
    cols = [
        ("Month", 12),
        ("Names bought (to date)", 14),
        ("Spent on leads (to date)", 14),
        ("Real conversations (to date)", 16),
        ("Policies written (to date)", 14),
        ("Revenue (to date)", 14),
        ("Cost per lead", 12),
        ("Contact rate", 12),
        ("Contact-to-close", 14),
        ("Avg revenue per close", 14),
        ("Cost per close", 12),
        ("Dials this month", 12),
        ("Real conversations this month", 16),
        ("Sales on video this month", 14),
        ("Hours worked this month", 14),
    ]
    header(nums, cols)
    nums.row_dimensions[1].height = 45
    for c in range(1, len(cols) + 1):
        nums.cell(row=1, column=c).alignment = Alignment(wrap_text=True, vertical="center")

    def formulas(r):
        return {
            7: f'=IFERROR(C{r}/B{r},"")',
            8: f'=IFERROR(D{r}/B{r},"")',
            9: f'=IFERROR(E{r}/D{r},"")',
            10: f'=IFERROR(F{r}/E{r},"")',
            11: f'=IFERROR(C{r}/E{r},"")',
        }

    money = '"$"#,##0.00'
    pct = "0.0%"
    fmts = {3: '"$"#,##0', 6: '"$"#,##0', 7: money, 8: pct, 9: pct, 10: '"$"#,##0', 11: money}

    # Row 2: Hank's numbers from Chapter 2, so a reader can see the sheet
    # reproduce the book: about $1.05, 7 in 100, 1 in 9, $640, about $143.
    example = ["Example: Hank (Ch 2)", 3112, 3280, 212, 23, 14720]
    for c, v in enumerate(example, start=1):
        nums.cell(row=2, column=c, value=v)
    for r in range(2, 3 + 24):
        for c, f in formulas(r).items():
            nums.cell(row=r, column=c, value=f)
        for c, fmt in fmts.items():
            nums.cell(row=r, column=c).number_format = fmt
    for c in range(1, len(cols) + 1):
        nums.cell(row=2, column=c).font = Font(italic=True, color="6B7280")

    wb.save(XLSX)

    with CSV.open("w", newline="") as f:
        csv.writer(f).writerow([n for n, _, _ in COLUMNS])


if __name__ == "__main__":
    build()
    print(f"wrote {XLSX.name} and {CSV.name}")
