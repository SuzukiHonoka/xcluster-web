import Box from "@mui/material/Box";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridEventListener,
    GridRowEditStopReasons,
    GridRowId,
    GridRowModel,
    GridRowModes,
    GridRowModesModel,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton,
    GridValidRowModel,
    GridValueGetterParams,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import PasswordIcon from "@mui/icons-material/Password";
import {useCallback, useEffect} from "react";
import CustomPagination from "../../components/CustomPagination";
import LinearProgress from "@mui/material/LinearProgress";
import {useAlert, useAppDispatch, useAppSelector} from "../../app/hook.ts";
import {
    fetchUsers,
    reset,
    resetStatus,
    selectError,
    selectStatus,
    selectUsers,
    userDelete,
    userUpdate,
} from "../../features/users/usersSlice.ts";
import {selectIsAdmin} from "../../features/auth/authSlice.ts";
import Typography from "@mui/material/Typography";
import React from "react";

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton/>
            <GridToolbarFilterButton/>
            <GridToolbarDensitySelector/>
            <GridToolbarExport/>
        </GridToolbarContainer>
    );
}

const UserManage = () => {
    const dispatch = useAppDispatch();
    const alert = useAlert();

    const isAdmin = useAppSelector(selectIsAdmin);
    const usersError = useAppSelector(selectError);
    const usersStatus = useAppSelector(selectStatus);
    const rows = useAppSelector(selectUsers);

    interface PromiseArgument {
        resolve(v: GridValidRowModel): void;

        reject(e: string): void;

        newRow: GridRowModel;
        oldRow: GridRowModel;
    }

    const [promiseArguments, setPromiseArguments] =
        React.useState<PromiseArgument | null>(null);
    //const [rows, setRows] = useState(users as GridRowsProp)
    // show success or error status
    useEffect(() => {
        console.log("usersStatus:", usersStatus);
        if (usersStatus === "succeed") {
            if (promiseArguments !== null)
                promiseArguments.resolve(promiseArguments.newRow);
            alert("Operation succeed", "success");
        } else if (usersStatus === "failed") {
            if (promiseArguments !== null) promiseArguments.reject(usersError!);
            alert(usersError!, "error");
        }
        return () => {
            dispatch(resetStatus());
            if (promiseArguments !== null) setPromiseArguments(null);
        };
    }, [alert, dispatch, promiseArguments, usersError, usersStatus]);

    // fetch users
    useEffect(() => {
        if (isAdmin) {
            dispatch(fetchUsers());
        } else {
            dispatch(reset());
        }
    }, [dispatch, isAdmin]);

    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
        {}
    );

    // note: event listener should not use useCallback
    const handleRowEditStop: GridEventListener<"rowEditStop"> = (
        params,
        event
    ) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = useCallback(
        (id: GridRowId) => () => {
            setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.Edit}});
        },
        [rowModesModel]
    );

    const changeUserPassword = useCallback(
        (id: GridRowId) => () => {
            setTimeout(() => {
                console.log("change password:", id);
                // todo: dialog popup, get user entered password and dispatch
            });
        },
        []
    );

    const handleSaveClick = useCallback(
        (id: GridRowId) => () => {
            setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View}});
        },
        [rowModesModel]
    );

    const handleDeleteClick = useCallback(
        (id: GridRowId) => () => {
            dispatch(userDelete(id as number));
        },
        [dispatch]
    );

    const handleCancelClick = useCallback(
        (id: GridRowId) => () => {
            // discard changes in model and editedRow
            setRowModesModel({
                ...rowModesModel,
                [id]: {mode: GridRowModes.View, ignoreModifications: true},
            });
        },
        [rowModesModel]
    );

    const processRowUpdate = useCallback(
        (newRow: GridRowModel, oldRow: GridRowModel) =>
            // console.log(newRow);
            // const updatedRow = { ...newRow, isNew: false };
            // //setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
            // return updatedRow;
            new Promise<GridRowModel>((resolve, reject) => {
                const differ: { [key: string]: string } = {};
                const newName = newRow.name.trim();
                const newEmail = newRow.email.trim();
                if (newName !== oldRow.name) differ["name"] = newName;
                if (newEmail !== oldRow.email) differ["email"] = newEmail;
                //const mutation = computeMutation(newRow, oldRow);
                if (Object.keys(differ).length > 0) {
                    // todo: update
                    setPromiseArguments({resolve, reject, newRow, oldRow});
                    dispatch(userUpdate({id: oldRow.id, ...differ}));
                } else {
                    resolve(oldRow); // Nothing was changed
                }
            }),
        [dispatch]
    );

    const handleProcessRowUpdateError = useCallback((error: string) => {
        console.error(error);
    }, []);

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
        {
            field: "id",
            type: "number",
            headerName: "ID",
            width: 150,
            align: "left",
            headerAlign: "left",
        },
        {
            field: "name",
            type: "string",
            headerName: "Name",
            width: 200,
            align: "left",
            editable: true,
        },
        {
            field: "email",
            type: "string",
            headerName: "Email",
            width: 200,
            align: "left",
            editable: true,
        },
        {
            field: "isAdmin",
            type: "boolean",
            headerName: "IsAdmin",
            width: 120,
            valueGetter: (params: GridValueGetterParams) => params.row.groupID === 1,
        },
        {
            field: "password",
            type: "actions",
            headerName: "Password",
            width: 100,
            editable: false,
            getActions: ({id}) => [
                <GridActionsCellItem
                    icon={<PasswordIcon/>}
                    label="Change Password"
                    onClick={changeUserPassword(id)}
                />,
            ],
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Action",
            width: 200,
            getActions: ({id}) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon/>}
                            label="Save"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon/>}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon/>}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon/>}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    // only admin can access this page
    if (!isAdmin) return <Typography variant="h1">Admin Required</Typography>;
    return (
        <Box
            sx={{
                height: "85vh",
                width: "100%",
                "& .actions": {
                    color: "text.secondary",
                },
                "& .textPrimary": {
                    color: "text.primary",
                },
            }}
        >
            <DataGrid
                pagination
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[10]}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                //checkboxSelection
                disableRowSelectionOnClick
                slots={{
                    toolbar: CustomToolbar,
                    pagination: CustomPagination,
                    loadingOverlay: LinearProgress,
                }}
                loading={usersStatus === "loading"}
            />
        </Box>
    );
};

export default UserManage;
