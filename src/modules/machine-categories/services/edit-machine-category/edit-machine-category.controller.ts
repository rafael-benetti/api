import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import EditMachineCategoryService from './edit-machine-category.service';

abstract class EditMachineCategoryController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { machineCategoryId } = req.params;
    const { label } = req.body;

    const editMachineCategory = container.resolve(EditMachineCategoryService);

    const machineCategory = await editMachineCategory.execute({
      userId,
      machineCategoryId,
      label,
    });

    return res.json(machineCategory);
  };
}

export default EditMachineCategoryController;
